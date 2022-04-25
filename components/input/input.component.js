import GComponent from "../g.component.js";
export default class GInput extends GComponent {
	constructor() {
		super();
		const _ = this;
		_.define();
	}
	define(){
		const _ = this;
		_._value = [];
		_.basePlaceholder = document.createElement('DIV');
		_.type = 'text';
		_.symbol = '*';
		_.componentName= 'input';
		_.validations = {
			'required': 'This field is required',
			'email': 'Wrong email address',
			'phone': 'Wrong phone format need: '+_.attr('pattern'),
			'match': 'Password not matched',
		};
		_
		//	.on('appended',_.doInput.bind(_))
			.on('doInput',_.doInput.bind(_))
			.on('preparePassword',_.preparePassword.bind(_))
			.on('doFocusIn',_.doFocusIn.bind(_))
			.on('doFocusOut',_.doFocusOut.bind(_))
			.on('doKeyDown',_.doKeyDown.bind(_))
			.on('fillMask',_.fillMask.bind(_))
			.on('getCaretPosition',_.getCaretPosition.bind(_))
			.on('changeDate',_.changeDate.bind(_))
			.on('setCheckboxValue',_.setCheckboxValue.bind(_))
	}
	
	
	get name(){
		const _ = this;
		return _.attr('name');
	}
	get value(){
		const _ = this;
		if(_.isSymbolPassword()) {
			if(_.type == 'password') {
				return _._value.toString().replace(/\,/g, '');
			}
			if(_.shadow.querySelector('.inpt-value-placeholder')) {
				return '';
			}
			return _.shadow.querySelector('.inpt-value').textContent
		}
		if(!_.isCheckbox()){
			return _.shadow.querySelector('.inpt-value').value
		}else{
			return _._value;
		}
		
	}
	get title(){
		const _ = this;
		return _.shadow.querySelector('.inpt-title').textContent;// = value;
	}
	
	set value(val){
		const _ = this;
		if(_.isSymbolPassword()) {
			_.shadow.querySelector('.inpt-value').innerHTML = val;
		}
		if(!_.isCheckbox()){
			_.shadow.querySelector('.inpt-value').value = val;
		}
		//_.value =
	}
	set title(value){
		const _ = this;
		_.shadow.querySelector('.inpt-title').textContent = value;
	}

	
	/* Outside methods*/
	
	
	
	doValidate(){
		const _ = this;
		let isValidate = true;
		if(!_.checkMatch()){
			_.setError('match',true);
			_.matchedElement.setError('match',true);
		}else	if(_.hasAttribute('required') && (!_.value)){
			_.setError('required',true);
			isValidate = false;
		}else if(_.isEmail()){
			if(!_.checkEmail()){
				_.setError('email',true);
			}
			isValidate = _.checkEmail();
		}else if(_.isPhone()){
			if(!_.checkPhone()){
				_.setError('phone',true);
			}
			isValidate = _.checkPhone();
		}
		return isValidate;
	}
	
	/* Outside methods*/
	/* Inside methods*/
	
	
	setCheckboxValue(changeData){
		const _ = this;
		let item = changeData['item'];
		if(_.attr('type') == 'checkbox'){
			let pos = _._value.indexOf(item.value);
			if( pos > -1){
				_._value.splice(pos,1);
			}else{
				_._value.push(item.value)
			}
		}else{
			_._value = item.value;
		}
		_.triggerChangeEvent();
	}
	changeDate(changeData){
		const _ = this;
		let item = changeData['item'],
		format = _.attr('format'),
		timeStamp = item.valueAsNumber,
		currentDate = new Date(timeStamp),
		day = currentDate.getDate(),
		month = currentDate.getMonth()+1,
		year = currentDate.getFullYear();
		if(day < 10) day = '0'+day;
		if(month < 10) month = '0'+month;
		let outValue = format;
		outValue = outValue.replace('DD',day);
		outValue = outValue.replace('YYYY',year);
		outValue = outValue.replace('MM',month);
		item.parentNode.querySelector('.inpt-value').value = outValue;
		item.parentNode.querySelector('.inpt-value').focus();
	}
	checkMatch(){
		const _ =  this
		let
			match = _.attr('match');
		if(!match) return true;
		_.matchedElement = document.querySelector(match);
		
		return _.matchedElement.value == _.value;
	}
	checkEmail(){
		let pattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
		return pattern.test(this.value);
	}
	checkPhone(){
		let pattern = /\+[0-9]{1,4}\([0-9]{3}\) *[0-9]{3}-+[0-9]{2}-[0-9]{2}/;
		return pattern.test(this.value);
	}
	doFocusIn(focusData){
		const _ = this;
		_.shadow.querySelector('.inpt-value').classList.add('focused');
		_.basePlaceholder.append(_.shadow.querySelector('.inpt-value-placeholder'));
	}
	doFocusOut(focusData){
		const _ = this;
		_.shadow.querySelector('.inpt-value').classList.remove('focused');
		if(_.isSymbolPassword()){
			if(!_.value)	_.shadow.querySelector('.inpt-value').append(_.basePlaceholder.firstElementChild);
		}
	}
	doKeyDown(keyData){
		const _ = this;
		let e = keyData['event'];
		if(_.isPhone() || _.isNumeric() || _.isDate()) {
			if( (!_.isSystemKey(e.key)) && !( (e.code == 'KeyA') && e.ctrlKey) ){
				if( (e.key == ' ') || (_.isLat(e.key)) || (_.isKir(e.key)) || (_.isAnotherSym(e.key)) ) e.preventDefault();
			}
		}
	}
	preparePassword(clickData){
		const _ = this;
		let
			e = clickData['event'];
		if( (e.key == 'Backspace') || (e.key == 'Delete')){
			//return e.preventDefault();
		}
	}
	fillMask(inputData){
		const _ = this;
		_._value = inputData['item'].value;
		_.value = _.createStars(_._value.length);
	}
	
	createStars(len){
		const _ = this;
		let str = "";
		for(let i=0; i < len;i++){
			if(!_.symbolImg){
				str+= _.symbol;
			}else{
				str+= `<img src='${_.symbolImg}'>`
			}
		}
		return str;
	}
	getCaretPosition () {
		const _ = this;
		let selection, sel,inpt =  _.shadow.querySelector('.inpt-value');
		if ('selectionStart' in inpt) {
			return inpt.selectionStart;
		}
		return -1;
	}
	
	dateHandle(){
		const _ = this;
		let
			cleanedValue = _.cleanValue(_.value),
			len = cleanedValue.length,
			tempValue = cleanedValue.split(''),
			format = _.attr('format'),
			firstPos = format.indexOf('-'),
			lastPos = format.lastIndexOf('-');
		
		if(len > firstPos - 1){
			tempValue.splice(firstPos,0,'-');
		}
		if(len > lastPos - 1){
			tempValue.splice(lastPos,0,'-')
		}
		if(len >= 9) {
			tempValue.pop();
		}
		_.attr('data-value',cleanedValue);
		_.value = tempValue.join('');
	}
	phoneHandle(){
		const _ = this;
		let
			cleanedValue = _.cleanValue(_.value),
			len = cleanedValue.length,
			tempValue = cleanedValue.split('');
		if(len > 1){
			tempValue.splice(1,0,'(');
		}
		if(len > 4){
			tempValue.splice(5,0,')')
			tempValue.splice(6,0,' ')
		}
		if(len > 7){
			tempValue.splice(10,0,'-')
		}
		if(len > 9){
			tempValue.splice(13,0,'-')
		}
		if(len >= 12) {
			tempValue.pop();
		}
		_.attr('data-value',cleanedValue);
		_.cursorPos = _.getCaretPosition();
		_.value = tempValue.join('');
	}
	urlHandle(){
		const _ =  this;
		let tempValue = _.value,
		pattern = 'http://';
		if(tempValue.indexOf(pattern) != 0){
			tempValue = '';
			_.value = pattern+tempValue;
		}
		
	}
	doInput(inputData){
		const _ =  this;
		_.removeError();
		let
			e = inputData['event'],
			input = inputData['item'];
		if(_.isSymbolPassword()){
			
			if( (e['inputType'] === 'deleteContentBackward') || (e['inputType'] === 'deleteContentForward') ){
				_._value.splice(input.selectionEnd,1);
				return false;
			}
			if(_.type === 'password'){
				_._value.push(e.data);
				_.value = _.createStars(_._value.length);
			}
		}
		
		if(_.isUrl()){
			_.urlHandle();
		}
		if(_.isPhone()){
			_.phoneHandle();
		}
		if(_.isDate()){
			_.dateHandle();
		}
	}
	cleanValue(value){
		const _ = this;
		value = value.replace('(','');
		value = value.replace(')','');
		value = value.replace(' ','');
		value = value.replaceAll('-','');
		return value;
	}
	isNumeric(){
		return this.attr('type') === 'numeric';
	}
	isPhone(){
		return this.attr('type') === 'phone';
	}
	isUrl(){
		return this.attr('type') === 'url';
	}
	isEmail(){
		return this.attr('type') === 'email';
	}
	isDate(){
		return this.attr('type') === 'date';
	}
	isCheckbox(){
		return (this.attr('type') === 'checkbox') || (this.attr('type') === 'radio');
	}
	isSystemKey(key){
		let keys = ['Backspace','Delete','ArrowLeft','ArrowRight']
		return keys.indexOf(key)>-1;
	}
	isKir(val){
		const _ = this;
		return /[а-яА-Я]/.test(val);
	}
	isLat(val){
		const _ = this;
		return /[a-zA-Z]/.test(val);
	}
	isAnotherSym(val){
		const _ = this;
		return /\W/.test(val);
	}
	
	setError(type,inner){
		const _ = this;
		let
			inpt = _.shadow.querySelector('.inpt'),
			tip = inpt.querySelector('.inpt-tip');
		if(!tip){
			let tipTpl;
			if(inner){
				tipTpl = _.markup(_.tipTpl(_.validations[type]));
			}else{
				tipTpl = _.markup(_.tipTpl(type));
			}
			inpt.append(tipTpl);
		}else{
			if(inner)	tip.textContent = _.validations[type];
			else tip.textContent = type;
		}
		setTimeout( ()=>{
			inpt.classList.add('error');
		});
	}
	removeError(type){
		const _ = this;
		let
			inpt = _.shadow.querySelector('.inpt'),
			tip = inpt.querySelector('.inpt-tip');
		inpt.classList.remove('error');
		setTimeout( ()=>{
			if(tip) tip.remove();
		},350);
	}
	
	/* Inside methods*/
	
	isSymbolPassword(){
		const _ = this;
		return _.hasAttribute('symbolImg')
	}
	
	
	
	async connectedCallback() {
		const _ = this;
		await _.initShadow();
		if(_.isSymbolPassword()){
			_.mainTpl = _.getTpl('symbolPassword');
		}else if(_.isDate()){
			_.mainTpl = _.getTpl('date');
		}else if(_.isCheckbox()){
			_.mainTpl = _.getTpl('check');
		}else{
			_.mainTpl = _.getTpl('input');
		}
		_.tipTpl = _.getTpl('tip');
		_.shadow.innerHTML = _.mainTpl({
			className: _.attr('className'),
			items: JSON.parse(_.attr('items')),
			format: _.attr('format'),
			type: _.attr('type'),
			name: _.attr('name'),
			title: _.attr('title'),
			placeholder: _.attr('placeholder')
		});
		_.type = _.attr('type');
		if(_.attr('symbol'))
		_.symbol = _.attr('symbol');
		_.symbolImg = _.attr('symbolImg');
		_.trigger('appended');
	}
	
	disconnectedCallback() {
	}
	static get observedAttributes() {
		return [];
	}
	attributeChangedCallback(name, oldValue, newValue) {
		const _ = this;
	}
}
customElements.define("g-input", GInput);