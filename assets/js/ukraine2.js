var block = `<style>.ukraine-div{position: absolute; display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; width: 100vw; -webkit-box-orient: vertical; -webkit-box-direction: normal; -webkit-flex-direction: column; -ms-flex-direction: column; flex-direction: column; -webkit-box-pack: center; -webkit-justify-content: center; -ms-flex-pack: center; justify-content: center; -webkit-box-align: center; -webkit-align-items: center; -ms-flex-align: center; align-items: center;}.slava-ukraini{width: 80%; max-width: 840px; margin-top: 80px; margin-bottom: 40px; padding: 40px; border-radius: 32px; background-color: #f3f3f3; text-align: center;}.slava-ukraini p{font-size: 16px; margin-bottom: 10px;}.slava-ukraini h2{margin-bottom: 16px; margin-top: 20px; font-size: 32px; line-height: 36px; font-weight: bold;}.slava-ukraini a{color: #0023ba; text-decoration: underline;}.button{padding: 12px 16px; border-radius: 16px; background-color: #1a3bc1;}</style><div class="ukraine-div"> <div class="slava-ukraini w-richtext"> <h2>Dear Dexie.js developers from Russia</h2> <p>On Feb 24, 2022 Russian forces started invading Ukraine. We know you, a regular person, are not to blame. But your leaders have chosen to invade a European country without any legitimation.</p><p>We ask you to protest in social media and in the streets to demand your<br>leaders stop this invasion. Peace and diplomacy are the only way towards a better world.</p><p>Support the Ukraine here → <a href="https://helpukrainewin.org/">https://helpukrainewin.org/</a> </p><p>🇺🇦 Slava Ukraini</p><p>‍</p><h2>Дорогие жители России</h2> <p>24 февраля 2022 года российские войска начали вторжение в Украину. Мы знаем, что вы, обычный человек, не виноваты. Но ваши лидеры решили вторгнуться в европейскую страну без какой-либо легитимации. Мы просим вас протестовать в социальных сетях и на улицах, чтобы потребовать от ваших лидеров остановить это вторжение. Мир и дипломатия — единственный путь к лучшему миру.</p><p>Поддержите Украину здесь → <a href="https://helpukrainewin.org/">https://helpukrainewin.org/</a> </p><p>🇺🇦 Слава Украине!</p><p>‍</p><p> <a href="http://www.nocodeflow.net/support-ukraine">Get this message for your website</a> </p></div><a href="#" class="button w-button" onclick="skip();">Continue to website / Перейти на сайт</a> </div>`

function skip(){
	sessionStorage.setItem("skip_ru",true);	
	location.reload();
}

function clearBody(){
    console.log("test");
    document.querySelector("body").innerHTML = block;
}

function check(){
	if(!sessionStorage.getItem("skip_ru")){
    	fetch("https://cdn.nocodeflow.net/dev/location.php").then(resp=>resp.text()).then(text=> {if(text === "1" || /ukraine/.test(location.hash)) clearBody(); });		
	}
}

check();