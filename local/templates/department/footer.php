<?
if(!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true)
	die();
?>
	</main>
		
<div class="app-modal" data-modal="modal" role="dialog" aria-label="Modal">
	<div class="app-modal-overlay" data-modal-close="modal"></div>
	<div class="app-modal-container js-light-element">
		<button class="rounded-btn modal-close-btn" data-modal-close="modal" aria-label="Закрыть модальное окно">
			<svg width="25" height="25" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M1 15.8L15.8 1M1 1l14.8 14.8" stroke="#fff" stroke-width="2" /></svg>
		</button>
		<div class="screen-partnership-content modal-form__content">
			<div class="screen-partnership-content__left">
				<div class="h1 screen-partnership__title modal-form__title">
					По любому вопросу отправляйте заявку через форму				
				</div>
			</div>
			<div class="screen-partnership-content__right">
				<form method="POST" action="<?= SITE_TEMPLATE_PATH ?>/ajax/request.php" class="js-ajax-form screen-partnership__form modal__form js-modal__forms" onsubmit="ga('send', 'event', 'request', 'send'); yaCounter65516512.reachGoal('sendRequest'); return true;">
					<div class="modal__form-inputs">
						<div style="display:none;">
							<input type="text" name="check_val" value="2EqgIw01oH" class="js-check-val">
						</div>
						<div class="modal__form-part">
							<div class="input-group">
								<input type="text" class="form-control floated-labels" id="modal__person-name" name="FORM_DATA[NAME]" required="">
								<label for="modal__person-name" class="label required">Как к вам обращаться?</label>
								<small class="app-message" aria-live="polite" aria-describedby="modal__person-name"></small>
							</div>
							<div class="input-group">
								<input type="tel" class="form-control floated-labels js-mask--phone js-validate--phone" id="modal__person-phone" name="FORM_DATA[PROPERTY_VALUES][S_PHONE]" required="">
								<label for="modal__person-phone" class="label required">Номер телефона</label>
								<small class="app-message" aria-live="polite" aria-describedby="modal__person-phone"></small>
							</div>
						</div>
						<div class="modal__form-part">
							<div class="input-group">
								<input type="email" class="form-control floated-labels js-validate--email" id="modal__person-email" name="FORM_DATA[PROPERTY_VALUES][S_EMAIL]">
								<label for="modal__person-email" class="label">Электронная почта</label>
								<small class="app-message" aria-live="polite" aria-describedby="modal__person-email"></small>
							</div>
							<div class="input-group">
								<input type="text" class="form-control floated-labels" id="modal__person-city" name="FORM_DATA[PROPERTY_VALUES][S_CITY]">
								<label for="modal__person-city" class="label">Город</label>
								<small class="app-message" aria-live="polite" aria-describedby="modal__person-city"></small>
							</div>
							<div class="input-group">
								<textarea class="form-control floated-labels" id="modal__person-message" name="FORM_DATA[PREVIEW_TEXT]" rows="2"></textarea>
								<label for="modal__person-message" class="label">Краткое описание ситуации</label>
								<small class="app-message" aria-live="polite" aria-describedby="modal__person-message"></small>
							</div>
							<div class="input-group">
								<label class="checkbox">
									<input type="checkbox" class="js-validate--checkbox" name="person-processing-data-agreement" required="">
									<span class="checkbox__element"></span>
									Я даю <a href="privacy" class="link">согласие</a> на обработку персональных данных								</label>
							</div>
						</div>
					</div>
					<div class="input-group modal__form-input-group">
						<button type="submit" class="btn btn-primary screen-partnership__submit-btn">Отправить</button>
					</div>
					<div class="form-messages contacts-form-messages js-form-messages form-messages--hidden">
						<div class="form-message js-form-message js-form-message__success form-message--hidden"></div>
						<div class="form-message js-form-message js-form-message__failure form-message--hidden"></div>
					</div>
					<input type="hidden" name="type" value="any-questions">
					<input type="hidden" name="lang" value="ru">
					<input type="hidden" name="sessid" id="sessid_1" value="ba15b6bb8c08c88529a30cc824242620" />				
				</form>
			</div>
		</div>
	</div>
</div>	<div class="app-modal" data-modal="map" role="dialog" aria-label="Карта">
			<div class="app-modal-container map-modal-container js-light-element">
				<button class="rounded-btn modal-close-btn" data-modal-close="map" aria-label="Закрыть модальное окно">
					<svg width="25" height="25" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M1 15.8L15.8 1M1 1l14.8 14.8" stroke="#fff" stroke-width="2" /></svg>
				</button>
				<div class="contacts-map js-map"></div>
			</div>
		</div>
		<script type="module" src="<?= SITE_TEMPLATE_PATH ?>/frontend/build/js/legacy/vendor.chunk.bed81113.js"></script>
		<script type="module" src="<?= SITE_TEMPLATE_PATH ?>/frontend/build/js/legacy/app.3c4ddfa6.js"></script>


<script async src="https://www.googletagmanager.com/gtag/js?id=UA-172327451-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-172327451-1');
</script>


<script type="text/javascript" >
   (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
   m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
   (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

   ym(65516512, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true
   });
</script>
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '658956701273370');
fbq('track', 'PageView');
</script>
<script>
			(function() {
				var d = document;
				var c = d.createElement('script');
				if (!('noModule' in c) && 'onbeforeload' in c) {
					var s = false;
					d.addEventListener('beforeload', function(e) {
						if (e.target === c) {
							s = true;
						} else if (!e.target.hasAttribute('nomodule') || !s) {
							return;
						}
						e.preventDefault();
					}, true);
					c.type = 'module';
					c.src = '.';
					d.head.appendChild(c);
					c.remove();
				}
			}());

		</script>
<script src="<?= SITE_TEMPLATE_PATH ?>/frontend/build/js/legacy/vendor.chunk.bed81113.js" nomodule="" defer="defer"></script>
<script src="<?= SITE_TEMPLATE_PATH ?>/frontend/build/js/legacy/app.3c4ddfa6.js" nomodule="" defer="defer"></script>
</body>
</html>