import G_G from "./G_G.js";
import { G_Bus } from "./G_Bus.js";
export class _front extends G_G{
  constructor() {
		super();
    const _ = this;
    _.componentName = 'front';
    _.libs = new Map();
    _.components = new Map();
    //
  }
	checkValidate(form){
		const _ = this;
		if(!form) return;
		let check = true;
		let
		inputs = form.querySelectorAll('g-input');
		for(let input of inputs){
			if(!input.doValidate()){
				check = false;
			}
		}
		return check;
	}
	gFormDataCapture(form) {
		const _ = this;
		let
		obj = {},
		items = form.querySelectorAll('.g-form-item');
		for(let item of items){
			if( (item.value instanceof Array) && (!item.value.length)){
				obj[item.name] = null;
			}else obj[item.name] = item.value;
		}
		return obj;
	}
	prepareForm(submitData){
		const _ = this;
		let
		form = submitData['item']
		if(_.checkValidate(form)){
			return _.gFormDataCapture(form);
		}
		return null;
	}
	define(){}
  init(){
    const _ = this;
  }

}