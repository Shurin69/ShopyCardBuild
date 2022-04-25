import { G_Bus } from "../../libs/G_Control.js";
import GComponent from "../g.component.js";
export default class GSelect extends GComponent {
	constructor() {
		super();
		const _ = this;
		_.define();

	}
	define(){
		const _ = this;
		_.opened = false;
		_.filteredAttributes = ['items','title']
		_.selectedValues = [];
		_.baseTitle = '';
		_.multiple = false;
		_.componentName= 'select';
		_.titles = [];
		_ .on('open',_.open.bind(_))
		_ .on('close',_.close.bind(_))
			.on('choose',_.choose.bind(_));
	}

	open(clickData){
		const _ = this;
		if(!_.opened){
			_.setProperty('--body-max-height','182px');
			_.opened = true;
			_.shadow.querySelector('.g-select').classList.add('active');
		}	else{
			_.close();
		}
	}
	close(){
		const _ = this;
		_.setProperty('--body-max-height',0);
		_.shadow.querySelector('.g-select').classList.remove('active');
		_.opened = false;
	}


	hasOption(prop,option){
		const _ = this;
		return _[prop].indexOf(option) > -1;
	}
	getOptionPosition(prop,option){
		const _ = this;
		return _[prop].indexOf(option);
	}
	removeOption(prop,option,field){
		const _ = this;
		let pos = _.getOptionPosition(prop,option[field]);
		_[prop].splice(pos,1);
		option.classList.remove('active');
	}
	handleOption(prop,option,field,callback){
		const _ = this;
		let
			value = option[field];
		if(_.hasOption(prop,value) && _.multiple){
			_.removeOption(prop,option,field);
		}else{
			if (!_.multiple) {
				_[prop] = [value];
			}else{
				_[prop].push(value);
			}
		}
		if(callback) callback();
	}
	changeActiveOption(option){
		const _ = this;
		let value = option.value;
		if (_.hasOption('selectedValues',value)) {
			if (!_.multiple) {
				let activeOption = _.shadow.querySelector('.g-select-body .active');
				if (activeOption) activeOption.classList.remove('active');
			}
			option.classList.add('active');
		}
	}
	setValue(){
		const _ = this;
		let slot =_.querySelector('[slot="value"]');
		if(!_.selectedValues.length){
			slot.removeAttribute('value');
			slot.value = '';
		}
		else slot.value = JSON.stringify(_.selectedValues);
	}
	setTitle(){
		const _ = this;
		if (!_.titles.length) _.setAttribute('title',_.baseTitle);
		else _.setAttribute('title',this.titles.toString());
	}

	choose(clickData){
		const _ = this;
		let
			item = _.ascent(clickData.event,'g-select-option');
		if(!item) return void 0;
		_.multiple = _.hasAttribute('multiple');

		_.handleOption('selectedValues',item,'value',	_.setValue.bind(_));
		_.handleOption('titles',item,'textContent',_.setTitle.bind(_));
		_.changeActiveOption(item);
		if( _.hasAttribute('action') ){
			G_Bus.trigger(_.getAttribute('action'), {
				name:_.querySelector('[slot="value"]')['name'],
				value: _.selectedValues,
				event: clickData.event
			});
		}
		if (!_.multiple) {
			_.close();
		}

	}
	createHiddenInput(data){
		const _ = this;
		return _.markup(_.getTpl('hiddenInput')(data));
	}
	async connectedCallback() {
		const _ = this;
		await _.importTpl('./select/template.js');
		_.shadow = this.attachShadow({mode: 'open'});
		_.mainTpl = _.getTpl('select');
		_.baseTitle = this.getAttribute('title');
		_.shadow.innerHTML = _.mainTpl({
			items: JSON.parse(this.getAttribute('items')),
			title: this.getAttribute('title'),
			name: this.getAttribute('name'),
			arrow: this.getAttribute('arrow'),
			arrowSvg: this.getAttribute('arrowSvg'),
			className: this.getAttribute('className')
		});

		_.append(_.createHiddenInput({
			name: this.getAttribute('name')
		}))

		_.fillAttributes();
		
		_.trigger('appended');
	}
	disconnectedCallback() {
	}
	static get observedAttributes() {
		return ['items','title'];
	}
	attributeChangedCallback(name, oldValue, newValue) {
		const _ = this;
		if(!_.mainTpl) return void 0;
		if(name == 'items'){
			let body = _.shadow.querySelector('.g-select-body');
			let tpl = _.getTpl('selectBody');
			body.innerHTML = tpl(JSON.parse(newValue));
		}
		if(name == 'title'){
			let title = _.shadow.querySelector('.g-select-title');
			title.textContent = newValue;
		}
	}
}
customElements.define("g-select", GSelect);