export default class GComponent extends HTMLElement {
	#_events = {}
	constructor(flag) {
		super();
		// элемент создан
		const _ = this;
		_.flag = flag;
		_.container = _;
		_.handle();
		_.filteredAttributes = [];
		_
			.on('appended',_.appended.bind(_))
	}
	appended(elem){
		document.styleSheets
		const _ = this;
		let cssLink  = document.createElement('link');
		cssLink.rel = 'stylesheet';
		cssLink.href = _.attr('stylesheet') ?? './components.css';
		_.shadow.append(cssLink);
		_.style.visibility= 'visible';
	}
	
	async initShadow(){
		const _ = this;
		if(_.shadow) return;
		await _.importTpl(`./${_.componentName}/template.js`);
		_.shadow = this.attachShadow({ mode: 'open' });
		_.style.visibility= 'hidden';
		_.container = _.shadow;
	}
	async importTpl(fileName='template', method = 'default') {
		const _ = this;
		let tpl = await import(fileName);
		_.tpls = tpl[method];
		return void 0;
	}
	getTpl(tplName){
		const _ = this;
		if(!_.tpls) return;
		return _.tpls[tplName] ?? '';
	}
	markup(domStr,isFragment=true){
		const _ = this;
		let
			fragment = document.createDocumentFragment(),
			parser= new DOMParser().parseFromString(domStr,'text/html');
		if(isFragment){
			fragment.append(...parser.body.children);
			return fragment;
		}
		return parser.body.children;
	}
	setProperty(property,value){
		const _ = this;
		_.style.setProperty(property,value);
	}
	appendTpl(tpl){
		const _ = this;
		_.shadow.innerHTML = tpl();
		_.fillAttributes();
	}

	attr(name,value){
		const _ = this;
		//if(!_.hasAttribute(name)) return;
		if(!value) return _.getAttribute(name);
		_.setAttribute(name,value);
	}

	fillAttributes(){
		const _ = this;
		for(let i=0; i < _.attributes.length;i++){
			let attr = _.attributes[i];
			if( (attr.name == 'style') || (attr.name == 'id')  ) continue;
			if(_.filteredAttributes.indexOf(attr.name) > -1 ) continue;
			_.setProperty(`--${attr.name}`,  attr.value);
		}
		/*	_.setProperty("--color",  this.getAttribute('color'));
			_.setProperty("--right",  this.getAttribute('right'));*/
	}
	/**/
	on(eventName,fn=eventName){
		const _ = this;
		if (!_.#_events[eventName]) {
			this.#_events[eventName] = []
		}
		this.#_events[eventName].push(fn)
		if(_.flag === 'dev'){
			console.warn(`Referring to an event: ${eventName}.Handler: ${fn.name}`);
		}
		return _;
	}
	trigger(eventName,data){
		const _ = this;
		return new Promise(function (resolve) {
			if(_.flag === 'dev'){
				console.log(`Trigger event: ${eventName} with data: "${data}" `);
			}
			try{
				if (_.#_events[eventName]) {
					_.#_events[eventName].forEach( async (fn) => resolve(await fn(data)))
				}
			} catch (e) {
				if(e.name == 'TypeError'){
					let errObj = {};
					errObj['err'] = e;
					errObj['event'] = eventName;
					errObj['line'] = e.lineNumber;
					console.log('%c%s',`background-color:#3f51b5;`,`!РћР±СЂР°С‰РµРЅРёРµ Рє СЃРѕР±С‹С‚РёСЋ, РєРѕС‚РѕСЂРѕРµ РЅРµ РѕРїСЂРµРґРµР»РµРЅРѕ ${componentName}: ${eventName}\n${e}`);
				}
			}
		})
	}
	remove(eventName,prop){
		const _ = this;
		if (_.#_events[eventName]) {
			delete _.#_events[eventName];
		}
	}
	/**/
	ascent(event,targetCls){
		const _ = this;
		let eventPath = event.composedPath();
		if(!eventPath.length) return;
		for(let i=0,len=eventPath.length; i < len;i++){
			let item = eventPath[i];
			if( (!item == _.container ) || (!item) || (!item.tagName) ) break;
			if( item.classList.contains(targetCls) ){
				return item;
			}
		}
	}
	/**/
	triggerWithEvent(data,currentAction){
		const _ = this;
		if (!data['item'])  return;
		let rawActions = data['item'].dataset[currentAction].split(';');
		rawActions.forEach( (action)=>{
			_.trigger(action,data);
		});
	}

	prepareHandler(e,dataEvent){
		const _ = this;
		let eventPath = e.composedPath();
		if(!eventPath.length) return;
		for(let i=0,len=eventPath.length; i < len;i++){
			let item = eventPath[i];
			if( (!item == _.container ) || (!item) || (!item.tagName) ) break;
			if( item.hasAttribute(`data-${dataEvent}`) ){
				_.triggerWithEvent({'item':item,'event':e},dataEvent);
				break;
			}
		}
	}

	clickHandler(e){ return this.prepareHandler(e,'click');}
	focusOutHandler(e){
		return this.prepareHandler(e,'focusout');
	}
	focusInHandler(e){return this.prepareHandler(e,'focusin');}
	changeHandler(e){return this.prepareHandler(e,'change');}
	inputHandler(e){
		return this.prepareHandler(e,'input');
	}
	keyUpHandler(e){ return this.prepareHandler(e,'keyup');}
	keyDownHandler(e){ return this.prepareHandler(e,'keydown');}
	mouseUpHandler(e){ return this.prepareHandler(e,'mouseup');}
	mouseDownHandler(e){ return this.prepareHandler(e,'mousedown');}
	submitHandler(e){ return this.prepareHandler(e,'submit');}
	scrollHandler(e){ return this.prepareHandler(e,'scroll');}
	overHandler(e){ return this.prepareHandler(e,'over');}

	dragStartHandler(e){ return this.prepareHandler(e,'dragStart');}
	dragOverHandler(e){ return this.prepareHandler(e,'dragOver');}
	dragEnterHandler(e){ return this.prepareHandler(e,'dragEnter');}
	dragLeaveHandler(e){ return this.prepareHandler(e,'dragLeave');}
	dropHandler(e){ return this.prepareHandler(e,'drop');}
	outHandler(e){ return this.prepareHandler(e,'out');}
	leaveHandler(e){ return this.prepareHandler(e,'leave');}

	triggerChangeEvent(){
		const changeEvent = new Event('change', {
			bubbles: true,
			cancelable: true
		});
		this.dispatchEvent(changeEvent);
	}

	handle(){
		const _  = this;
		//_.container = _.shadow;
		_.container.addEventListener('focusout',_.focusOutHandler.bind(_));
		_.container.addEventListener('focusin',_.focusInHandler.bind(_));
		_.container.addEventListener('submit',_.submitHandler.bind(_));
		_.container.addEventListener('click', _.clickHandler.bind(_));
		_.container.addEventListener('change',_.changeHandler.bind(_));
		_.container.addEventListener('input',_.inputHandler.bind(_));
		_.container.addEventListener('keyup',_.keyUpHandler);
		_.container.addEventListener('keydown',_.keyDownHandler);
		_.container.addEventListener('mouseup',_.mouseUpHandler.bind(_));
		_.container.addEventListener('mousedown',_.mouseDownHandler.bind(_));
		_.container.addEventListener('mouseover',_.overHandler);
		_.container.addEventListener('mouseout',_.outHandler);
		_.container.addEventListener('mouseleave',_.leaveHandler);
		_.container.addEventListener('dragstart',_.dragStartHandler);
		_.container.addEventListener('dragenter',_.dragEnterHandler);
		_.container.addEventListener('dragleave',_.dragLeaveHandler);
		_.container.addEventListener('dragover',_.dragOverHandler);
		_.container.addEventListener('drop',_.dropHandler);
		_.container.addEventListener('scroll',_.scrollHandler);
	}
	/**/
}
