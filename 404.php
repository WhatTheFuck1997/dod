<?
include_once($_SERVER['DOCUMENT_ROOT'].'/bitrix/modules/main/include/urlrewrite.php');

CHTTP::SetStatus("404 Not Found");
@define("ERROR_404","Y");

require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");

$APPLICATION->SetTitle("404 Not Found");

$APPLICATION->IncludeComponent("bitrix:main.map", ".default", Array(
	"LEVEL"	=>	"3",
	"COL_NUM"	=>	"2",
	"SHOW_DESCRIPTION"	=>	"Y",
	"SET_TITLE"	=>	"Y",
	"CACHE_TIME"	=>	"36000000"
	)
);
?>

<div class="content not-found-content">
	<div class="app-container not-found-container">
		<h1 class="not-found__title">
			<span class="not-found__title-num">4</span>
			<span class="not-found__title-num">0</span>
			<span class="not-found__title-num">4</span>
		</h1>
		<div class="not-found-bottom">
			<p class="not-found__description text-lg">Такой страницы не существует</p>
			<a href="/" class="back-link not-found-back-link js-back-link">
				<svg width="92" height="25" viewBox="0 0 92 25" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M90.637 12.691H2.178M17.073 1.146L1.271 12.728l15.802 11.413" stroke="#3C3C3C"></path>
				</svg>
				<div class="back-link__text">Назад</div>
			</a>
		</div>
	</div>
</div>
<footer class="footer">
	<div class="footer__row wrapper">
	</div>
</footer>

<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>