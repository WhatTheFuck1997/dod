<?
require($_SERVER['DOCUMENT_ROOT'].'/bitrix/header.php');
?> 

<section id="main" class="screen screen--active js-screen screen-main" data-screen="main" data-screen-theme="dark">
	<div class="screen__bg-container">
		<video class="screen__bg js-preview" playsinline loop muted autoplay>
			<source src="<?= SITE_TEMPLATE_PATH ?>/frontend/src/video_bg.webm" type="video/webm">
			<source src="<?= SITE_TEMPLATE_PATH ?>/frontend/src/video_bg.mp4" type="video/mp4">
		</video>
	</div>
	<div class="wrapper index-wrapper">
		<div class="screen-content js-screen-content">
			<div class="main-block">
				<div class="main-block__title">
					<div>
						<?$APPLICATION->IncludeComponent(
						"bitrix:main.include",
						"",
						Array(
							"AREA_FILE_SHOW" => "file",
							"AREA_FILE_SUFFIX" => "inc",
							"COMPOSITE_FRAME_MODE" => "A",
							"COMPOSITE_FRAME_TYPE" => "AUTO",
							"EDIT_TEMPLATE" => "",
							"PATH" => "/local/templates/department/includes/main_title.php"
						)
					);?>
					</div>
				</div>
				<div class="index-separator-container">
					<div class="app-separator index-separator" aria-hidden="true"></div>
				</div>
				<div class="main__text">
					<div>
						<?$APPLICATION->IncludeComponent(
						"bitrix:main.include",
						"",
						Array(
							"AREA_FILE_SHOW" => "file",
							"AREA_FILE_SUFFIX" => "inc",
							"COMPOSITE_FRAME_MODE" => "A",
							"COMPOSITE_FRAME_TYPE" => "AUTO",
							"EDIT_TEMPLATE" => "",
							"PATH" => "/local/templates/department/includes/main_desc.php"
						)
					);?>
					</div>
					<button type="button" class="btn btn-outline-primary btn-light btn-high"  data-modal-open="modal" onclick="ga('send', 'event', 'request', 'open'); yaCounter55123375.reachGoal('openRequest'); return true;"ы>ПОЛУЧИТЬ КОНСУЛЬТАЦИЮ</button>
				</div>
			</div>
		</div>
		<div class="screen-bottom">
			<div class="screen-counter-mobile js-screen-counter-mobile" data-theme="dark"></div>
			<div class="screen-main__next-slide-btn-container">
				<button class="next-slide-btn js-main__next-slide-btn js-entering__arrow" aria-label="Перейти к следующему слайду">
					<svg width="25" height="92" viewBox="0 0 25 92" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M12.191.863v88.459M.646 74.427L12.23 90.228l11.41-15.801" stroke="#2D1813" />
					</svg>
				</button>
			</div>
		</div>
	</div>
</section>




<section id="services" class="screen screen-services js-screen" data-screen="services">
	<div class="wrapper index-wrapper">
		<div class="screen-content js-screen-content">
			<h2 class="visually-hidden">Услуги</h2>
			<div class="screen-services-list-container js-screen-services-container screen-services-list-container--active js-services-list--">
				<div class="services-container js-services-bg">
					<div class="services-rtl">
						<?$APPLICATION->IncludeComponent("bitrix:news.list", "list_services", Array(
						"ACTIVE_DATE_FORMAT" => "d.m.Y",	// Формат показа даты
							"ADD_SECTIONS_CHAIN" => "N",	// Включать раздел в цепочку навигации
							"AJAX_MODE" => "N",	// Включить режим AJAX
							"AJAX_OPTION_ADDITIONAL" => "",	// Дополнительный идентификатор
							"AJAX_OPTION_HISTORY" => "N",	// Включить эмуляцию навигации браузера
							"AJAX_OPTION_JUMP" => "N",	// Включить прокрутку к началу компонента
							"AJAX_OPTION_STYLE" => "N",	// Включить подгрузку стилей
							"CACHE_FILTER" => "N",	// Кешировать при установленном фильтре
							"CACHE_GROUPS" => "N",	// Учитывать права доступа
							"CACHE_TIME" => "36000000",	// Время кеширования (сек.)
							"CACHE_TYPE" => "A",	// Тип кеширования
							"CHECK_DATES" => "Y",	// Показывать только активные на данный момент элементы
							"COMPOSITE_FRAME_MODE" => "A",	// Голосование шаблона компонента по умолчанию
							"COMPOSITE_FRAME_TYPE" => "AUTO",	// Содержимое компонента
							"DETAIL_URL" => "",	// URL страницы детального просмотра (по умолчанию - из настроек инфоблока)
							"DISPLAY_BOTTOM_PAGER" => "Y",	// Выводить под списком
							"DISPLAY_DATE" => "N",	// Выводить дату элемента
							"DISPLAY_NAME" => "N",	// Выводить название элемента
							"DISPLAY_PICTURE" => "Y",	// Выводить изображение для анонса
							"DISPLAY_PREVIEW_TEXT" => "N",	// Выводить текст анонса
							"DISPLAY_TOP_PAGER" => "N",	// Выводить над списком
							"FIELD_CODE" => array(	// Поля
								0 => "NAME",
								1 => "Название",
								2 => "Описание анонса",
								3 => "Картинка для анонса",
								4 => "",
							),
							"FILTER_NAME" => "",	// Фильтр
							"HIDE_LINK_WHEN_NO_DETAIL" => "N",	// Скрывать ссылку, если нет детального описания
							"IBLOCK_ID" => "1",	// Код информационного блока
							"IBLOCK_TYPE" => "content",	// Тип информационного блока (используется только для проверки)
							"INCLUDE_IBLOCK_INTO_CHAIN" => "N",	// Включать инфоблок в цепочку навигации
							"INCLUDE_SUBSECTIONS" => "N",	// Показывать элементы подразделов раздела
							"MESSAGE_404" => "",	// Сообщение для показа (по умолчанию из компонента)
							"NEWS_COUNT" => "20",	// Количество новостей на странице
							"PAGER_BASE_LINK_ENABLE" => "N",	// Включить обработку ссылок
							"PAGER_DESC_NUMBERING" => "N",	// Использовать обратную навигацию
							"PAGER_DESC_NUMBERING_CACHE_TIME" => "36000",	// Время кеширования страниц для обратной навигации
							"PAGER_SHOW_ALL" => "N",	// Показывать ссылку "Все"
							"PAGER_SHOW_ALWAYS" => "N",	// Выводить всегда
							"PAGER_TEMPLATE" => "",	// Шаблон постраничной навигации
							"PAGER_TITLE" => "Новости",	// Название категорий
							"PARENT_SECTION" => "",	// ID раздела
							"PARENT_SECTION_CODE" => "",	// Код раздела
							"PREVIEW_TRUNCATE_LEN" => "",	// Максимальная длина анонса для вывода (только для типа текст)
							"PROPERTY_CODE" => array(	// Свойства
								0 => "",
								1 => "",
							),
							"SET_BROWSER_TITLE" => "N",	// Устанавливать заголовок окна браузера
							"SET_LAST_MODIFIED" => "N",	// Устанавливать в заголовках ответа время модификации страницы
							"SET_META_DESCRIPTION" => "N",	// Устанавливать описание страницы
							"SET_META_KEYWORDS" => "N",	// Устанавливать ключевые слова страницы
							"SET_STATUS_404" => "N",	// Устанавливать статус 404
							"SET_TITLE" => "N",	// Устанавливать заголовок страницы
							"SHOW_404" => "N",	// Показ специальной страницы
							"SORT_BY1" => "SORT",	// Поле для первой сортировки новостей
							"SORT_BY2" => "",	// Поле для второй сортировки новостей
							"SORT_ORDER1" => "ASC",	// Направление для первой сортировки новостей
							"SORT_ORDER2" => "",	// Направление для второй сортировки новостей
							"STRICT_SECTION_CHECK" => "N",	// Строгая проверка раздела для показа списка
						),
						false
					);?>
					</div>
				</div>
			</div>
		</div>
		<div class="screen-bottom">
			<div class="screen-counter-mobile js-screen-counter-mobile" data-theme="light"></div>
		</div>
	</div>
</section>



<section id="about" class="screen js-screen screen-about" data-screen="about">
	    <div class="subscreen subscreen-about-1 subscreen--active js-subscreen" data-screen="about-1" data-screen-theme="dark">
        <!-- <div class="screen__bg-container">
            <picture>
                <img src="<?= SITE_TEMPLATE_PATH ?>/frontend/build/img/about-bg-img.jpg" alt="" class="screen__bg">
            </picture>
        </div> -->
        <div class="wrapper index-wrapper">
            <div class="screen-content js-screen-content">
                <h2 class="visually-hidden">О компании</h2>
                <div class="content-columns screen-about-content">
                    <div class="content-column screen-about-content__left">
                        <div class="main-block__title">
                        	<?$APPLICATION->IncludeComponent(
							"bitrix:main.include",
							"",
							Array(
								"AREA_FILE_SHOW" => "file",
								"AREA_FILE_SUFFIX" => "inc",
								"COMPOSITE_FRAME_MODE" => "A",
								"COMPOSITE_FRAME_TYPE" => "AUTO",
								"EDIT_TEMPLATE" => "",
								"PATH" => "/local/templates/department/includes/about_title.php"
							)
						);?>
                        </div>
                        <div class="screen-about-content__left-bottom">
                        	<?$APPLICATION->IncludeComponent(
							"bitrix:main.include",
							"",
							Array(
								"AREA_FILE_SHOW" => "file",
								"AREA_FILE_SUFFIX" => "inc",
								"COMPOSITE_FRAME_MODE" => "A",
								"COMPOSITE_FRAME_TYPE" => "AUTO",
								"EDIT_TEMPLATE" => "",
								"PATH" => "/local/templates/department/includes/about_text_min.php"
							)
						);?>                    
                        </div>
                    </div>
                    <div class="content-column screen-about-content__right">
                        <p class="h2 screen-about__text">
                        	<?$APPLICATION->IncludeComponent(
							"bitrix:main.include",
							"",
							Array(
								"AREA_FILE_SHOW" => "file",
								"AREA_FILE_SUFFIX" => "inc",
								"COMPOSITE_FRAME_MODE" => "A",
								"COMPOSITE_FRAME_TYPE" => "AUTO",
								"EDIT_TEMPLATE" => "",
								"PATH" => "/local/templates/department/includes/about_text.php"
							)
						);?>
                        </p>
                    </div>
                </div>
            </div>
            <div class="screen-bottom">
                <div class="screen-counter-mobile js-screen-counter-mobile" data-theme="dark"></div>
            </div>
        </div>
    </div>
    <div class="subscreen screen-advantages js-subscreen" data-screen="about-2" data-screen-theme="dark">
        <div class="wrapper index-wrapper">
            <div class="screen-content screen-advantages-content js-screen-content">
				<h2 class="visually-hidden">Наша команда</h2>
				<div class="h1 screen-team__title">Наша команда</div>
				<div class="team-list-container vacancies-list-container--dragscroll" data-simplebar="">
				    <?$APPLICATION->IncludeComponent(
					"bitrix:news.list", 
					"list_employess", 
					array(
						"ACTIVE_DATE_FORMAT" => "d.m.Y",
						"ADD_SECTIONS_CHAIN" => "N",
						"AJAX_MODE" => "N",
						"AJAX_OPTION_ADDITIONAL" => "",
						"AJAX_OPTION_HISTORY" => "N",
						"AJAX_OPTION_JUMP" => "N",
						"AJAX_OPTION_STYLE" => "N",
						"CACHE_FILTER" => "N",
						"CACHE_GROUPS" => "N",
						"CACHE_TIME" => "36000000",
						"CACHE_TYPE" => "A",
						"CHECK_DATES" => "Y",
						"COMPOSITE_FRAME_MODE" => "A",
						"COMPOSITE_FRAME_TYPE" => "AUTO",
						"DETAIL_URL" => "",
						"DISPLAY_BOTTOM_PAGER" => "N",
						"DISPLAY_DATE" => "N",
						"DISPLAY_NAME" => "N",
						"DISPLAY_PICTURE" => "Y",
						"DISPLAY_PREVIEW_TEXT" => "N",
						"DISPLAY_TOP_PAGER" => "N",
						"FIELD_CODE" => array(
							0 => "NAME",
							1 => "Название",
							2 => "Описание для анонса",
							3 => "Картинка для анонса",
							4 => "",
						),
						"FILTER_NAME" => "",
						"HIDE_LINK_WHEN_NO_DETAIL" => "N",
						"IBLOCK_ID" => "2",
						"IBLOCK_TYPE" => "-",
						"INCLUDE_IBLOCK_INTO_CHAIN" => "N",
						"INCLUDE_SUBSECTIONS" => "N",
						"MESSAGE_404" => "",
						"NEWS_COUNT" => "20",
						"PAGER_BASE_LINK_ENABLE" => "N",
						"PAGER_DESC_NUMBERING" => "N",
						"PAGER_DESC_NUMBERING_CACHE_TIME" => "36000",
						"PAGER_SHOW_ALL" => "N",
						"PAGER_SHOW_ALWAYS" => "N",
						"PAGER_TEMPLATE" => ".default",
						"PAGER_TITLE" => "Новости",
						"PARENT_SECTION" => "",
						"PARENT_SECTION_CODE" => "",
						"PREVIEW_TRUNCATE_LEN" => "",
						"PROPERTY_CODE" => array(
							0 => "",
							1 => "",
						),
						"SET_BROWSER_TITLE" => "N",
						"SET_LAST_MODIFIED" => "N",
						"SET_META_DESCRIPTION" => "N",
						"SET_META_KEYWORDS" => "N",
						"SET_STATUS_404" => "N",
						"SET_TITLE" => "N",
						"SHOW_404" => "N",
						"SORT_BY1" => "SORT",
						"SORT_BY2" => "",
						"SORT_ORDER1" => "ASC",
						"SORT_ORDER2" => "",
						"STRICT_SECTION_CHECK" => "N",
						"COMPONENT_TEMPLATE" => "list_employess"
					),
					false
				);?>
				</div>
                <div class="subscreen__small-block">
                </div>
            </div>
            <div class="screen-bottom">
                <div class="screen-counter-mobile js-screen-counter-mobile" data-theme="light"></div>
            </div>
        </div>
	</div>
</section>


<section id="vacancies" class="screen js-screen" data-screen="vacancies">
	<div class="wrapper index-wrapper">
		<div class="screen-content js-screen-content">
			<h2 class="visually-hidden">Вакансии</h2>
			<div class="h1 screen-vacancies__title">В нашу команду требуются:</div>
			<div class="vacancies-list-container vacancies-list-container--dragscroll" data-simplebar="" >
				<?$APPLICATION->IncludeComponent(
				"bitrix:news",
				"vacancies",
				Array(
					"ADD_ELEMENT_CHAIN" => "N",
					"ADD_SECTIONS_CHAIN" => "N",
					"AJAX_MODE" => "N",
					"AJAX_OPTION_ADDITIONAL" => "",
					"AJAX_OPTION_HISTORY" => "N",
					"AJAX_OPTION_JUMP" => "N",
					"AJAX_OPTION_STYLE" => "N",
					"BROWSER_TITLE" => "-",
					"CACHE_FILTER" => "N",
					"CACHE_GROUPS" => "N",
					"CACHE_TIME" => "36000000",
					"CACHE_TYPE" => "A",
					"CHECK_DATES" => "Y",
					"COMPOSITE_FRAME_MODE" => "A",
					"COMPOSITE_FRAME_TYPE" => "AUTO",
					"DETAIL_ACTIVE_DATE_FORMAT" => "d.m.Y",
					"DETAIL_DISPLAY_BOTTOM_PAGER" => "N",
					"DETAIL_DISPLAY_TOP_PAGER" => "N",
					"DETAIL_FIELD_CODE" => array("NAME","Название","Описание для анонса","Детальное описание",""),
					"DETAIL_PAGER_SHOW_ALL" => "N",
					"DETAIL_PAGER_TEMPLATE" => "",
					"DETAIL_PAGER_TITLE" => "Страница",
					"DETAIL_PROPERTY_CODE" => array("","conditions",""),
					"DETAIL_SET_CANONICAL_URL" => "N",
					"DISPLAY_BOTTOM_PAGER" => "N",
					"DISPLAY_DATE" => "N",
					"DISPLAY_NAME" => "N",
					"DISPLAY_PICTURE" => "N",
					"DISPLAY_PREVIEW_TEXT" => "N",
					"DISPLAY_TOP_PAGER" => "N",
					"HIDE_LINK_WHEN_NO_DETAIL" => "N",
					"IBLOCK_ID" => "3",
					"IBLOCK_TYPE" => "content",
					"INCLUDE_IBLOCK_INTO_CHAIN" => "N",
					"LIST_ACTIVE_DATE_FORMAT" => "d.m.Y",
					"LIST_FIELD_CODE" => array("NAME",""),
					"LIST_PROPERTY_CODE" => array("",""),
					"MESSAGE_404" => "",
					"META_DESCRIPTION" => "-",
					"META_KEYWORDS" => "-",
					"NEWS_COUNT" => "20",
					"PAGER_BASE_LINK_ENABLE" => "N",
					"PAGER_DESC_NUMBERING" => "N",
					"PAGER_DESC_NUMBERING_CACHE_TIME" => "36000",
					"PAGER_SHOW_ALL" => "N",
					"PAGER_SHOW_ALWAYS" => "N",
					"PAGER_TEMPLATE" => ".default",
					"PAGER_TITLE" => "Новости",
					"PREVIEW_TRUNCATE_LEN" => "",
					"SEF_FOLDER" => "/vacancies/",
					"SEF_MODE" => "Y",
					"SEF_URL_TEMPLATES" => Array("detail"=>"#ELEMENT_CODE#/","news"=>"","section"=>""),
					"SET_LAST_MODIFIED" => "N",
					"SET_STATUS_404" => "Y",
					"SET_TITLE" => "N",
					"SHOW_404" => "N",
					"SORT_BY1" => "SORT",
					"SORT_BY2" => "",
					"SORT_ORDER1" => "ASC",
					"SORT_ORDER2" => "",
					"STRICT_SECTION_CHECK" => "N",
					"USE_CATEGORIES" => "N",
					"USE_FILTER" => "N",
					"USE_PERMISSIONS" => "N",
					"USE_RATING" => "N",
					"USE_RSS" => "N",
					"USE_SEARCH" => "N",
					"USE_SHARE" => "N"
				)
			);?>
			</div>
		</div>
		<div class="screen-bottom">
			<div class="screen-counter-mobile js-screen-counter-mobile" data-theme="light"></div>
		</div>
	</div>
</section>



<section id="partnership" class="screen screen-partnership js-screen" data-screen="partnership">
    <div class="wrapper index-wrapper">
        <div class="screen-content js-screen-content screen-partnership__screen-content">
            <h2 class="visually-hidden">Сотрудничество</h2>
            <div class="screen-partnership-content">
                <div class="screen-partnership-content__left">
                    <div class="h1 screen-partnership__title">
                    	<?$APPLICATION->IncludeComponent(
							"bitrix:main.include",
							"",
							Array(
								"AREA_FILE_SHOW" => "file",
								"AREA_FILE_SUFFIX" => "inc",
								"COMPOSITE_FRAME_MODE" => "A",
								"COMPOSITE_FRAME_TYPE" => "AUTO",
								"EDIT_TEMPLATE" => "",
								"PATH" => "/local/templates/department/includes/partnership_title.php"
							)
						);?>
                    </div>
                </div>
                <div class="screen-partnership-content__right">
                    <form method="POST" action="https://dod-ru.ru/local/ajax/request.php" class="js-ajax-form screen-partnership__form" onsubmit="ga('send', 'event', 'cooperation', 'send'); yaCounter65516512.reachGoal('SendRequestForCooperation'); return true;">
                        <div class="screen-partnership__form-inputs screen-partnership__form-first-block">
                            <div style="display:none;">
                                <input type="text" name="check_val" value="TyVtKEscC9" class="js-check-val">
                            </div>
                            <div class="screen-partnership__form-part">
                                <div class="input-group">
                                    <input type="text" class="form-control floated-labels" id="person-name" name="FORM_DATA[NAME]" required="">
                                    <label for="person-name" class="label required">Как к вам обращаться?</label>
                                    <small class="app-message" aria-live="polite" aria-describedby="person-name"></small>
                                </div>
                                <div class="input-group">
                                    <input type="text" class="form-control floated-labels" id="person-company" name="FORM_DATA[PROPERTY_VALUES][S_COMPANY]">
                                    <label for="person-company" class="label">Из какой вы компании?</label>
                                    <small class="app-message" aria-live="polite" aria-describedby="person-company"></small>
                                </div>
                                <div class="input-group">
                                    <input type="text" class="form-control floated-labels" id="person-position" name="FORM_DATA[PROPERTY_VALUES][S_POSITION]">
                                    <label for="person-position" class="label">Ваша должность?</label>
                                    <small class="app-message" aria-live="polite" aria-describedby="person-position"></small>
                                </div>
                            </div>
                            <div class="screen-partnership__form-part">
                                <div class="input-group">
                                    <input type="tel" class="form-control floated-labels js-mask--phone js-validate--phone" id="person-phone" name="FORM_DATA[PROPERTY_VALUES][S_PHONE]" required="">
                                    <label for="person-phone" class="label required">Номер телефона</label>
                                    <small class="app-message" aria-live="polite" aria-describedby="person-phone"></small>
                                </div>
                                <div class="input-group">
                                    <input type="email" class="form-control floated-labels js-validate--email" id="person-email" name="FORM_DATA[PROPERTY_VALUES][S_EMAIL]">
                                    <label for="person-email" class="label">Электронная почта</label>
                                    <small class="app-message" aria-live="polite" aria-describedby="person-email"></small>
                                </div>
                                <div class="input-group">
                                    <input type="text" class="form-control floated-labels" id="person-city" name="FORM_DATA[PROPERTY_VALUES][S_CITY]">
                                    <label for="person-city" class="label">Город</label>
                                    <small class="app-message" aria-live="polite" aria-describedby="person-city"></small>
                                </div>
                                <div class="input-group">
                                    <textarea class="form-control floated-labels" id="person-message" name="FORM_DATA[PREVIEW_TEXT]" rows="2"></textarea>
                                    <label for="person-message" class="label">Текст (Например: «Предлагаем сотрудничать…»)</label>
                                    <small class="app-message" aria-live="polite" aria-describedby="person-message"></small>
                                </div>
                                <div class="input-group">
                                    <label class="checkbox">
                                        <input type="checkbox" class="js-validate--checkbox" name="person-processing-data-agreement" required="">
                                        <span class="checkbox__element"></span>
                                        Я даю <a href="privacy" class="link">согласие</a> на обработку персональных данных                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="input-group screen-partnership__form-input-group">
                            <button type="submit" class="btn btn-outline-primary screen-partnership__submit-btn">
                                Отправить                            </button>
                        </div>
                        <div class="form-messages contacts-form-messages js-form-messages form-messages--hidden">
                            <div class="form-message js-form-message js-form-message__success form-message--hidden"></div>
                            <div class="form-message js-form-message js-form-message__failure form-message--hidden"></div>
                        </div>
                        <input type="hidden" name="type" value="the-issues-of-cooperation">
                        <input type="hidden" name="lang" value="ru">
                        <input type="hidden" name="sessid" id="sessid" value="ba15b6bb8c08c88529a30cc824242620" />                    </form>
                </div>
            </div>
        </div>
        <div class="screen-bottom">
            <div class="screen-counter-mobile js-screen-counter-mobile" data-theme="light"></div>
        </div>
    </div>
</section>



<section id="contacts" class="screen js-screen screen-contacts" data-screen="contacts" data-screen-theme="dark">
    <div class="wrapper index-wrapper">
        <div class="screen-content screen-contacts-content js-screen-content">
            <h2 class="visually-hidden">Контакты</h2>
            <div class="main-block__title">
                <a href="tel:+79082059009" class="link screen-contacts__phone">+7 (908) 205 90 09</a> <span class="screen-contacts__label">(многоканальный)</span>
            </div>
            <ul class="list-unstyled contacts-cities-list text-lg lines-list">
                <li class="contacts-cities-list-item">
                    <a href="index.html#krasnoyarsk" class="link contacts-cities-link tab-control tab-control--active">Красноярск</a>
                </li>
                <li class="contacts-cities-list-item">
                    <a href="index.html#moscow" class="link contacts-cities-link tab-control ">Москва</a>
                </li>
                <li class="contacts-cities-list-item">
                    <a href="index.html#krasnodar" class="link contacts-cities-link tab-control ">Краснодар</a>
                </li>
                <li class="contacts-cities-list-item">
                    <a href="index.html#perm" class="link contacts-cities-link tab-control ">Пермь</a>
                </li>
                <li class="contacts-cities-list-item">
                    <a href="index.html#novosibirsk" class="link contacts-cities-link tab-control ">Новосибирск</a>
                </li>
                <li class="contacts-cities-list-item">
                    <a href="index.html#chita" class="link contacts-cities-link tab-control ">Чита</a>
                </li>
                <li class="contacts-cities-list-item">
                    <a href="index.html#abakan" class="link contacts-cities-link tab-control ">Абакан</a>
                </li>
            </ul>
            <div class="screen-contacts-info tab tab--active" data-tab="krasnoyarsk">
                <div class="screen-contacts-info__row">
                    <div class="screen-contacts-info__left">
                    	Адрес
                    </div>
                    <div class="screen-contacts-info__middle">
                       	Красноярский край, г.Красноярск улица Линейная 89, оф. 412/1, 413/1<br/>4 этаж
                    </div>
                    <div class="screen-contacts-info__right">
                        <button class="link screen-contacts__map-link" data-modal-open="map" data-lat="56.0323677" data-lng="92.8774186">
                             Показать на карте                                    
                        </button>
                    </div>
                </div>
                <div class="screen-contacts-info__row">
                    <div class="screen-contacts-info__left">
                    	Время работы
                    </div>
                    <div class="screen-contacts-info__middle">
                        пн-пт: 08:00-20:00<br>сб: 09:00-15:00<br>вс: выходной                            
                    </div>
                    <div class="screen-contacts-info__right"></div>
                </div>
                <div class="screen-contacts-info__row">
                    <div class="screen-contacts-info__left">
                    	Электронная почта
                    </div>
                    <div class="screen-contacts-info__middle">
                        <a href="mailto:info@dod-ru.ru" class="link screen-contacts__link">
                                    info@dod-ru.ru                                
                        </a>
                    </div>
                    <div class="screen-contacts-info__right"></div>
                </div>
            </div>
            <div class="screen-contacts-info tab " data-tab="moscow">
                <div class="screen-contacts-info__row">
                    <div class="screen-contacts-info__left">
                    	Адрес
                    </div>
                    <div class="screen-contacts-info__middle">
                    	Ленинская слобода 19, БЦ Омега плаза, 4 этаж ОЦ деловой<br/>409/1 офис
                    </div>
                    <div class="screen-contacts-info__right">
                        <button class="link screen-contacts__map-link" data-modal-open="map" data-lat="55.708354" data-lng="37.652705">
                            Показать на карте                                    
                        </button>
                    </div>
                </div>
                <div class="screen-contacts-info__row">
                    <div class="screen-contacts-info__left">
                    	Время работы
                    </div>
                    <div class="screen-contacts-info__middle">
                        пн-пт: 08:00-20:00<br>сб: 09:00-15:00<br>вс: выходной                            
                    </div>
                    <div class="screen-contacts-info__right"></div>
                </div>
                <div class="screen-contacts-info__row">
                    <div class="screen-contacts-info__left">
                    	Электронная почта
                    </div>
                    <div class="screen-contacts-info__middle">
                        <a href="mailto:info@dod-ru.ru" class="link screen-contacts__link">
                            info@dod-ru.ru                                
                        </a>
                    </div>
                	<div class="screen-contacts-info__right"></div>
                </div>
            </div>
            <div class="screen-contacts-info tab " data-tab="krasnodar">
                <div class="screen-contacts-info__row">
                    <div class="screen-contacts-info__left">
                    	Адрес
                    </div>
                    <div class="screen-contacts-info__middle">
                    	РФ, Краснодарский край, г.Краснодар ул.Северная 326, офис 804/1
                    </div>
                    <div class="screen-contacts-info__right">
                        <button class="link screen-contacts__map-link" data-modal-open="map" data-lat="45.040438" data-lng="38.970786">
                                        Показать на карте                                    
                        </button>
                    </div>
                </div>
               	<div class="screen-contacts-info__row">
                    <div class="screen-contacts-info__left">
                    	Время работы
                    </div>
                    <div class="screen-contacts-info__middle">
                        пн-пт: 08:00-20:00<br>сб: 09:00-15:00<br>вс: выходной                            
                    </div>
                    <div class="screen-contacts-info__right"></div>
                </div>
                <div class="screen-contacts-info__row">
                   	<div class="screen-contacts-info__left">
                   		Электронная почта
                   	</div>
                    <div class="screen-contacts-info__middle">
                        <a href="mailto:info@dod-ru.ru" class="link screen-contacts__link">
                            info@dod-ru.ru                                
                        </a>
                    </div>
                    <div class="screen-contacts-info__right"></div>
                </div>
            </div>
            <div class="screen-contacts-info tab " data-tab="perm">
                <div class="screen-contacts-info__row">
                    <div class="screen-contacts-info__left">
                    	Адрес
                    </div>
                    <div class="screen-contacts-info__middle">
                    	РФ, Пермский край, г.Пермь ул.Горького 34, офис 405/1
                    </div>
                    <div class="screen-contacts-info__right">
                        <button class="link screen-contacts__map-link" data-modal-open="map" data-lat="58.013964" data-lng="56.254075">
                            Показать на карте                                    
                        </button>
                    </div>
                </div>
                <div class="screen-contacts-info__row">
                            <div class="screen-contacts-info__left">Время работы</div>
                            <div class="screen-contacts-info__middle">
                                пн-пт: 08:00-20:00<br>сб: 09:00-15:00<br>вс: выходной                            </div>
                            <div class="screen-contacts-info__right"></div>
                        </div>
                                                                <div class="screen-contacts-info__row">
                            <div class="screen-contacts-info__left">Электронная почта</div>
                            <div class="screen-contacts-info__middle">
                                <a href="mailto:info@dod-ru.ru" class="link screen-contacts__link">
                                    info@dod-ru.ru                                </a>
                            </div>
                            <div class="screen-contacts-info__right"></div>
                        </div>
                                    </div>
                            <div class="screen-contacts-info tab " data-tab="novosibirsk">
                                            <div class="screen-contacts-info__row">
                            <div class="screen-contacts-info__left">Адрес</div>
                            <div class="screen-contacts-info__middle">РФ, Новосибирская область, г.Новосибирск ул.Челюскинцев 44/2, офис 313/1</div>
                                                            <div class="screen-contacts-info__right">
                                    <button class="link screen-contacts__map-link" data-modal-open="map" data-lat="55.040002" data-lng="82.908213">
                                        Показать на карте                                    </button>
                                </div>
                                                    </div>
                                                                <div class="screen-contacts-info__row">
                            <div class="screen-contacts-info__left">Время работы</div>
                            <div class="screen-contacts-info__middle">
                                пн-пт: 08:00-20:00<br>сб: 09:00-15:00<br>вс: выходной                            </div>
                            <div class="screen-contacts-info__right"></div>
                        </div>
                                                                <div class="screen-contacts-info__row">
                            <div class="screen-contacts-info__left">Электронная почта</div>
                            <div class="screen-contacts-info__middle">
                                <a href="mailto:info@dod-ru.ru" class="link screen-contacts__link">
                                    info@dod-ru.ru                                </a>
                            </div>
                            <div class="screen-contacts-info__right"></div>
                        </div>
                                    </div>
                            <div class="screen-contacts-info tab " data-tab="chita">
                                            <div class="screen-contacts-info__row">
                            <div class="screen-contacts-info__left">Адрес</div>
                            <div class="screen-contacts-info__middle">672000 Забайкальский край,г.Чита,ул.Журавлева 20,офис 506/1</div>
                                                            <div class="screen-contacts-info__right">
                                    <button class="link screen-contacts__map-link" data-modal-open="map" data-lat="52.034694" data-lng="113.496818">
                                        Показать на карте                                    </button>
                                </div>
                                                    </div>
                                                                <div class="screen-contacts-info__row">
                            <div class="screen-contacts-info__left">Время работы</div>
                            <div class="screen-contacts-info__middle">
                                пн-пт: 08:00-20:00<br>сб: 09:00-15:00<br>вс: выходной                            </div>
                            <div class="screen-contacts-info__right"></div>
                        </div>
                                                                <div class="screen-contacts-info__row">
                            <div class="screen-contacts-info__left">Электронная почта</div>
                            <div class="screen-contacts-info__middle">
                                <a href="mailto:info@dod-ru.ru" class="link screen-contacts__link">
                                    info@dod-ru.ru                                </a>
                            </div>
                            <div class="screen-contacts-info__right"></div>
                        </div>
                                    </div>
                            <div class="screen-contacts-info tab " data-tab="abakan">
                                            <div class="screen-contacts-info__row">
                            <div class="screen-contacts-info__left">Адрес</div>
                            <div class="screen-contacts-info__middle">655016, г. Абакан, ул. Лермонтова, 18</div>
                                                            <div class="screen-contacts-info__right">
                                    <button class="link screen-contacts__map-link" data-modal-open="map" data-lat="53.740930" data-lng="91.419813">
                                        Показать на карте                                    </button>
                                </div>
                                                    </div>
                                                                <div class="screen-contacts-info__row">
                            <div class="screen-contacts-info__left">Время работы</div>
                            <div class="screen-contacts-info__middle">
                                пн-пт: 08:00-20:00<br>сб: 09:00-15:00<br>вс: выходной                            </div>
                            <div class="screen-contacts-info__right"></div>
                        </div>
                                                                <div class="screen-contacts-info__row">
                            <div class="screen-contacts-info__left">Электронная почта</div>
                            <div class="screen-contacts-info__middle">
                                <a href="mailto:info@dod-ru.ru" class="link screen-contacts__link">
                                    info@dod-ru.ru                                </a>
                            </div>
                            <div class="screen-contacts-info__right"></div>
                        </div>
                                    </div>
                    </div>
        <div class="screen-bottom">
            <div class="screen-counter-mobile js-screen-counter-mobile" data-theme="dark"></div>
        </div>
    </div>
    <footer class="footer">
        <div class="footer__row wrapper">
            
</div>        </div>
    </footer>
</section>

<?
require($_SERVER['DOCUMENT_ROOT'].'/bitrix/footer.php');
?>