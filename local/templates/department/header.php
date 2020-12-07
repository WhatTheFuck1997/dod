<?
if(!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true)
	die();

use Bitrix\Main\Page\Asset;
?>
<!DOCTYPE html>
<html class="no-js" lang="ru">
	<head>
		<title><? $APPLICATION->ShowTitle(); ?></title>
		<meta name="description" content="">
		<meta name="viewport" content="width=device-width,initial-scale=1">
		<link rel="shortcut icon" href="<?= SITE_TEMPLATE_PATH ?>/frontend/build/img/favicon/favicon.ico">
	<? 

	global $USER;  
	if($USER->IsAdmin()){ 
	    $APPLICATION->ShowHead(); 
	} else { 
	    $APPLICATION->ShowMeta("keywords");
	?>
	
	
	<link rel="stylesheet" type="text/css" href="<?= SITE_TEMPLATE_PATH ?>/frontend/build/css/6.app.min.775545ee.css">
	<link rel="stylesheet" type="text/css" href="<?= SITE_TEMPLATE_PATH ?>/frontend/build/css/app.min.9366190d.css">
	<link rel="preload" href="<?= SITE_TEMPLATE_PATH ?>/frontend/build/fonts/Montserrat-Regular.ttf" as="font" type="font/ttf" crossorigin="anonymous">
	<link rel="preload" href="<?= SITE_TEMPLATE_PATH ?>/frontend/build/fonts/Montserrat-Medium.ttf" as="font" type="font/ttf" crossorigin="anonymous">
	<link rel="preload" href="<?= SITE_TEMPLATE_PATH ?>/frontend/build/fonts/Montserrat-Bold.ttf" as="font" type="font/ttf" crossorigin="anonymous">
	<script data-skip-moving="true">
		(document.documentElement && document.documentElement.className && (function(html) {
			html.className = html.className.replace("no-js", "js");
		})(document.documentElement));
	</script>
	<script type="module" src="<?= SITE_TEMPLATE_PATH ?>/frontend/build/js/legacy/inputmask.chunk.fa5c20d6.js"></script>
	<script type="module" src="<?= SITE_TEMPLATE_PATH ?>/frontend/build/js/legacy/validator.chunk.20d3bc5c.js"></script>
	<script type="module" src="<?= SITE_TEMPLATE_PATH ?>/frontend/build/js/legacy/ajax-form-sender.chunk.077e01f7.js"></script>
	<script type="module" src="<?= SITE_TEMPLATE_PATH ?>/frontend/build/js/legacy/ajax-form-sender-custom.js"></script>
	<script type="module" src="https://mc.yandex.ru/metrika/tag.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
	<script type="text/javascript">var _ba = _ba || []; _ba.push(["aid", "b878f88afafb812c5448ed4144e9bdbd"]); _ba.push(["host", "dod-ru.ru"]); (function() {var ba = document.createElement("script"); ba.type = "text/javascript"; ba.async = true;ba.src = (document.location.protocol == "https:" ? "https://" : "http://") + "bitrix.info/ba.js";var s = document.getElementsByTagName("script")[0];s.parentNode.insertBefore(ba, s);})();</script>

	<?
	}
		Asset::getInstance()->addCss(SITE_TEMPLATE_PATH . "/frontend/build/css/6.app.min.775545ee.css");
		Asset::getInstance()->addCss(SITE_TEMPLATE_PATH . "/frontend/build/css/app.min.9366190d.css");
		Asset::getInstance()->addString('<link rel="preload" href="' . SITE_TEMPLATE_PATH . '/frontend/build/fonts/Montserrat-Regular.ttf" as="font" type="font/ttf" crossorigin="anonymous">');
		Asset::getInstance()->addString('<link rel="preload" href="' . SITE_TEMPLATE_PATH . '/frontend/build/fonts/Montserrat-Medium.ttf" as="font" type="font/ttf" crossorigin="anonymous">');
		Asset::getInstance()->addString('<link rel="preload" href="' . SITE_TEMPLATE_PATH . '/frontend/build/fonts/Montserrat-Bold.ttf" as="font" type="font/ttf" crossorigin="anonymous">');
		Asset::getInstance()->addString('<script data-skip-moving="true">
		(document.documentElement && document.documentElement.className && (function(html) {
			html.className = html.className.replace("no-js", "js");
		})(document.documentElement));
		</script>');
		Asset::getInstance()->addJs(SITE_TEMPLATE_PATH . "/frontend/build/js/legacy/inputmask.chunk.fa5c20d6.js");
		Asset::getInstance()->addJs(SITE_TEMPLATE_PATH . "/frontend/build/js/legacy/validator.chunk.20d3bc5c.js");
		Asset::getInstance()->addJs(SITE_TEMPLATE_PATH . "/frontend/build/js/legacy/ajax-form-sender.chunk.077e01f7.js");
		Asset::getInstance()->addJs(SITE_TEMPLATE_PATH . "/frontend/build/js/legacy/ajax-form-sender-custom.js");
		Asset::getInstance()->addJs("https://mc.yandex.ru/metrika/tag.js");

		CJSCore::Init(array("jquery"));

	?>

	<meta property="og:locale" content="ru">
	<meta property="og:type" content="website">
	<meta property="og:title" content="Департамент оценочной деятельности">
	<meta property="og:description" content="">
	<meta property="og:image" content="<?= SITE_TEMPLATE_PATH ?>/frontend/build/img/og-image.jpg">
	<meta name="twitter:card" content="summary">
	<meta name="twitter:image" content="<?= SITE_TEMPLATE_PATH ?>/frontend/build/img/og-image.jpg">
	<meta name="twitter:title" content="Департамент оценочной деятельности">
	<meta name="twitter:description" content="">

	<meta name="yandex-verification" content="1c36a1673b023e56">

	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	
	<!-- Global site tag (gtag.js) - Google Analytics -->
	<!-- Yandex.Metrika counter -->
	<noscript><div><img src="https://mc.yandex.ru/watch/65516512" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
	<!-- /Yandex.Metrika counter -->

	<!-- Facebook Pixel Code -->
	<noscript>
		<img height="1" width="1" src="https://www.facebook.com/tr?id=658956701273370&ev=PageView&noscript=1"/>
	</noscript>
	<!-- End Facebook Pixel Code -->
</head>
	<?

		$url = ((!empty($_SERVER['HTTPS'])) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
		if (strpos($url, '/vacancies/') !== false) 
		{
	?>
		<body class="vacancy-page">
	<?
    		$vacancies = true;
		}else{
	?>
		<body class="index-page">
	<?
			$vacancies = false;
		}
	?>
		<div class="panel">
			<? $APPLICATION->ShowPanel(); ?>
		</div>
		<div class="preloader preloader--dark js-preloader-dark"></div>
		<header class="header js-header sticky-header js-sticky-header">
			<div class="wrapper header__row">
				<div class="header__left">
					<a href="/" class="logo header__logo js-entering-logo js-light-element" aria-label="Перейти на главную" data-transition="dark">
						<img src="<?= SITE_TEMPLATE_PATH ?>/frontend/build/img/ru/logo.svg" alt="Логотип Департамент оценочной деятельности" title="Логотип Департамент оценочной деятельности" class="img-fluid logo__img logo-black">
						<img src="<?= SITE_TEMPLATE_PATH ?>/frontend/build/img/ru/logo-white.svg" alt="Логотип Департамент оценочной деятельности" title="Логотип Департамент оценочной деятельности" class="img-fluid logo__img logo-white">
					</a>
				</div>
				<div class="header__center">
					
<nav class="nav-container" data-modal="menu">
	<button class="close-menu-btn" data-modal-close="menu" aria-label="Закрыть меню">
		<svg width="25" height="25" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M1 15.8L15.8 1M1 1l14.8 14.8" stroke="#fff" stroke-width="2" /></svg>
	</button>
	<div class="nav-modal-container">
		<ul class="list-unstyled nav-list">
				<?$APPLICATION->IncludeComponent(
	"bitrix:menu", 
	"top_menu", 
	array(
		"ALLOW_MULTI_SELECT" => "N",
		"CHILD_MENU_TYPE" => "left",
		"COMPOSITE_FRAME_MODE" => "A",
		"COMPOSITE_FRAME_TYPE" => "AUTO",
		"DELAY" => "N",
		"MAX_LEVEL" => "1",
		"MENU_CACHE_GET_VARS" => array(
		),
		"MENU_CACHE_TIME" => "3600",
		"MENU_CACHE_TYPE" => "N",
		"MENU_CACHE_USE_GROUPS" => "N",
		"ROOT_MENU_TYPE" => "top",
		"USE_EXT" => "N",
		"COMPONENT_TEMPLATE" => "top_menu"
	),
	false
);?>
					</ul>
	</div>
</nav>
<button class="burger-btn header__burger-btn" data-modal-open="menu" aria-label="Меню" aria-haspopup="true">
	<span class="burger">
		<span class="burger__line"></span>
		<span class="burger__line"></span>
	</span>
</button>				</div>
				<div class="header__right">
						<button class="btn btn-outline-primary" data-modal-open="modal" onclick="ga('send', 'event', 'request', 'open'); yaCounter65516512.reachGoal('openRequest'); return true;">Заявка</button>
				</div>
			</div>
		</header>

		<main class="main">

<aside class="aside aside-left js-entering__aside">
	<div class="aside-content">
		<noscript class="noscript-js-announcement">Включите JavaScript в настройках браузера.</noscript>
		<? 
			if($vacancies){
		?>
			<div class="screen__name screen__name--active">Вакансии</div>
	        <a href="../../" class="back-link aside__back-link js-back-link" aria-label="Назад">
	            <svg width="92" height="25" viewBox="0 0 92 25" fill="none" xmlns="http://www.w3.org/2000/svg">
	                <path d="M90.637 12.691H2.178M17.073 1.146L1.271 12.728l15.802 11.413" stroke="#3C3C3C" />
				</svg>
	        </a>
		<?
			}else{
		?>
		<ul class="list-unstyled screen__names">
				<li class="screen__name" data-name-of="main">Главная</li>
				<li class="screen__name" data-name-of="services">Услуги</li>
				<li class="screen__name" data-name-of="about">О компании</li>
				<li class="screen__name" data-name-of="vacancies">Вакансии</li>
				<li class="screen__name" data-name-of="partnership">Сотрудничество</li>
    			<li class="screen__name" data-name-of="contacts">Контакты</li>
		</ul>
		<div class="screen-counter js-screen-counter">
			<div class="screen-counter__current js-screen-counter__current"></div>
			<div class="screen-counter__total js-screen-counter__total"></div>
		</div>
		<? } ?>
		
	</div>
</aside>