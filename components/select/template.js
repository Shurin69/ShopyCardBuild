export default {
	'select': (data={}) => {
		let tpl = `
			<slot name="value"></slot>
			<div class="g-select ${data['className'] ?? ''}" tabindex="0" data-focusout="close">
				<div class="g-select-head ${((!data['arrow']) && (!data['arrowSvg'])) ? 'with-arrow' : ''}" data-click="open">
					<h6 class="g-select-title">${data['title']}</h6>
					${data['arrow'] ? '<div class="g-select-arrow"><img src="'+data['arrow']+'"></div>' : ''}
					${data['arrowSvg'] ? '<div class="g-select-arrow"><svg><use xlink:href="'+data['arrowSvg']+'"></svg></div>' : ''}
				</div>
				<div class="g-select-body" data-click="choose">`;
		if( !(!data['items'] || !data['items'].length )){
			data['items'].forEach( item =>{
				tpl+=`<button class="g-select-option" value="${item.value}"><span>${item.text}</span></button>`
			});
		}
  
		tpl+=`		
		</div>
		</div>
	`;
		return tpl;
	},
	selectBody : (items) =>{
		let tpl = ``;
		
		items.forEach( item =>{
			tpl+=`<button  class="g-select-option" value="${item.value}">${item.text}</button>`
		});
		return tpl;
	},
	hiddenInput: (data)=>{
		return `<input type='hidden' name='${data['name']}' slot='value'>`
	}
}