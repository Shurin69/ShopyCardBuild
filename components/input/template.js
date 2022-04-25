export default {
    //	<link rel="stylesheet" href= ${data['stylesheet'] ?? "./components.css"}>
    'symbolPassword': (data = {}) => `
		<label class="inpt ${data['className'] ?? ''}">
			${data['title'] ? '<h6 class="inpt-title">'+data['title']+'</h6>' : ''}
			<span contenteditable="true"
				tabindex="0"
				class="inpt-value"
				data-input="doInput"
				data-focusin="doFocusIn"
				data-focusout="doFocusOut"
				>
				${data['placeholder'] ? '<em class="inpt-value-placeholder">'+data['placeholder']+'</em>' : ''}
			</span>
			<input type="text" 	data-focusin="doFocusIn" data-focusout="doFocusOut" class="inpt-mask" data-input="fillMask">
		</label>`,
    'tip': (tip) =>
        `${tip ? '<span class="inpt-tip">'+tip+'</span>' : ''}`,
    'input': (data = {}) => `
		<label class="inpt ${data['className'] ?? ''}">
			${data['title'] ? '<h6 class="inpt-title">'+data['title']+'</h6>' : ''}
			<input
				${data['placeholder'] ? 'placeholder='+data['placeholder'] : ''}
				${ (data['type']=='phone') || (data['type']=='numeric') ? 'data-keydown="doKeyDown"' : '' }
				type="${data['type']}"
				class="inpt-value ${data['className'] ?? ''}"
				data-input="doInput"
				data-focusout="doFocusOut"
				data-click="getCaretPosition"
			>
		</label>`,
    'check': (data = {}) => {
        let items = ``;
        if (!data['items'] || !data['items'].length) return '<span class="inpt-checkbox-items-fail">Items not found</span>';
        data['items'].forEach(item => {
            let id = Math.random(9999);
            items += `
				<input class="inpt-checkbox" type="${data['type']}" value="${item.value}" name="${data['name']}" id="${id}" data-input="setCheckboxValue">
				<label class="inpt-checkbox-label" for="${id}" >${item.text ? '<span class="inpt-checkbox-label-text">'+item.text+'</span>' : '' } </label>
			`
        });
        return `
			<div class="inpt ${data['className'] ?? ''}">
				${data['title'] ? '<h6 class="inpt-title">'+data['title']+'</h6>' : ''}
				<div class="inpt-checkbox-cont">${items}</div>
			</div>
		`;
    },
    'date': (data = {}) => `
		<label class="inpt ${data['className'] ?? ''}">
			${data['title'] ? '<h6 class="inpt-title">'+data['title']+'</h6>' : ''}
			<input
				${data['placeholder'] ? 'placeholder='+data['placeholder'] : ''}
				data-keydown="doKeyDown"
				type="text"
				class="inpt-value"
				data-input="doInput"
				data-focusout="doFocusOut"
			>
			<span class="inpt-mask-placeholder">${data['format']}</span>
			<input type="date"
				data-input="changeDate" class="inpt-mask-date" >
				<svg width="13" height="13" viewBox="0 0 13 13" class="inpt-date-img" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path fill-rule="evenodd" clip-rule="evenodd" d="M1.625 3.33329C1.625 2.68896 2.14733 2.16663 2.79167 2.16663H10.2083C10.8527 2.16663 11.375 2.68896 11.375 3.33329V10.75C11.375 11.3943 10.8527 11.9166 10.2083 11.9166H2.79167C2.14733 11.9166 1.625 11.3943 1.625 10.75V3.33329Z" stroke="#5068E2" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M8.66663 1.08337V3.25004" stroke="#5068E2" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M4.33337 1.08337V3.25004" stroke="#5068E2" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M1.625 5.41663H11.375" stroke="#5068E2" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
		</label>`
}

//${ (data['type'] == 'password') ? 'data-keydown="preparePassword"' : ''}