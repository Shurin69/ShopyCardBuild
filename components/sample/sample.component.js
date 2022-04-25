import { G_Bus } from "../../../libs/G_Control.js";
import GComponent from "../g.component.js";
export default class GSample extends GComponent {
	constructor() {
		super();
		const _ = this;
		_.define();
	}
	define(){
		const _ = this;
		
		
	}
	async connectedCallback() {
		const _ = this;
		await _.importTpl('./sample/template.js');
		_.shadow = this.attachShadow({mode: 'open'});
		_.mainTpl = _.getTpl('sample');
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
customElements.define("g-Sample", GSample);