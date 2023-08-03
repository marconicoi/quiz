window.addEventListener('DOMContentLoaded', (event) => {
	document.querySelectorAll('.quiz-container[src]').forEach(el => {
		const tq = el.children[0].outerHTML;
		const tr = el.children[1].outerHTML;
		el.innerHTML = '<div style="position:relative;height:100%;width:100%;overflow:hidden"></div>';
		const div = el.querySelector('div');
		fetch(el.getAttribute('src'))
		.then((response) => response.json())
		.then((data) => {
			if (data.questions && Array.isArray(data.questions)) {
				const nav = document.createElement('div');
				nav.style.position = 'absolute';
				nav.style.left = '.5rem';
				nav.style.right = '.5rem';
				nav.style.bottom = '.5rem';
				nav.style.height = '1rem';
				nav.style.display = 'flex';
				nav.style.gap = '.25rem';
				nav.style.alignItems = 'center';
				nav.style.justifyContent = 'center';
				if (data.shuffle) {
					data.questions = data.questions.map(value => ({value, sort: Math.random()})).sort((a, b) => a.sort-b.sort).map(({value}) => value);
				}
				if (data.limit && Number.isInteger(+data.limit)) {
					data.questions = data.questions.slice(0, +data.limit);
				}
				data.questions.forEach(qu => {
					const se = document.createElement('section');
					se.innerHTML = tq;
					se.hidden = true;
					se.style.position = 'absolute';
					se.style.overflowY = 'scroll';
					se.style.inset = '0';
					se.style.transition = 'all .3s ease-in-out';
					se.querySelectorAll('.title').forEach(el => el.innerText = qu.title);
					se.querySelectorAll('.text').forEach(el => el.innerText = qu.text);
					const to = se.querySelector('.quiz-option').outerHTML;
					const oc = se.querySelector('.quiz-options');
					const tmp = document.createElement('div');
					if (oc && qu.options && Array.isArray(qu.options)) {
						oc.innerHTML = '';
						qu.options.forEach(op => {
							tmp.innerHTML = to;
							Array.from(tmp.querySelector('*').childNodes).filter(no => no.nodeType == Node.TEXT_NODE).forEach(el => el.nodeValue = op.text);
							tmp.querySelector('input[type=radio]').val = op.points;
							oc.appendChild(tmp.children[0]);
						});
					}
					div.appendChild(se);
					const dot = document.createElement('div');
					dot.title = qu.title;
					dot.hidden = true;
					dot.style.width = '.5rem';
					dot.style.height = '.5rem';
					dot.style.borderRadius = '.25rem';
					dot.style.cursor = 'pointer';
					dot.style.backgroundColor = 'rgba(0,0,0,.5)';
					dot.addEventListener('click', e => {
						div.querySelectorAll('section').forEach(el => el.hidden = true);
						se.style.transform = 'translate(100%)';
						se.hidden = false;
						dot.hidden = false;
						setTimeout(e => se.style.transform = '', 0);
					});
					nav.appendChild(dot);
				});
				if (!data.navigable) {
					nav.style.display = 'none';
				}
				const se = document.createElement('section');
				se.innerHTML = tr;
				se.hidden = true;
				se.style.position = 'absolute';
				se.style.inset = '0';
				se.style.transition = 'all .3s ease-in-out';
				const dot = document.createElement('div');
				dot.hidden = true;
				dot.style.width = '.5rem';
				dot.style.height = '.5rem';
				dot.style.cursor = 'pointer';
				dot.style.backgroundColor = 'rgba(0,0,0,.5)';
				dot.addEventListener('click', e => {
					div.querySelectorAll('section').forEach(el => el.hidden = true);
					se.style.transform = 'translate(100%)';
					if (data.results && Array.isArray(data.results)) {
						const total = Array.from(div.querySelectorAll('input:checked')).reduce((a, c) => a + c.val, 0);
						data.results.forEach(re => {
							if (re.min <= total) {
								se.querySelectorAll('.title').forEach(el => el.innerText = re.title);
								se.querySelectorAll('.text').forEach(el => el.innerText = re.text);
								if (re.image) {
									se.querySelectorAll('.image').forEach(el => el.src = re.image);
								}
							}
						});
					}
					se.hidden = false;
					dot.hidden = false;
					setTimeout(e => se.style.transform = '', 0);
				});
				div.appendChild(se);
				nav.appendChild(dot);
				div.appendChild(nav);
				div.querySelectorAll('.quiz-option').forEach(op => {
					const idx = Array.from(div.querySelectorAll('.quiz-container>div>section')).indexOf(op.closest('.quiz-container>div>section'));
					op.querySelectorAll('input[type=radio').forEach(el => el.name='opt-'+idx);
					op.addEventListener('click', e => {
						nav.querySelectorAll('div')[idx+1].click();
					});
				});
				nav.querySelector('div').click();
			}
			else {
				console.log('Invalid source - no questions');
			}
		})
		.catch((error) => console.error(error));
	});
});
