<?if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();
/** @var array $arParams */
/** @var array $arResult */
/** @global CMain $APPLICATION */
/** @global CUser $USER */
/** @global CDatabase $DB */
/** @var CBitrixComponentTemplate $this */
/** @var string $templateName */
/** @var string $templateFile */
/** @var string $templateFolder */
/** @var string $componentPath */
/** @var CBitrixComponent $component */
$this->setFrameMode(true);
?>
<pre>
	<? //print_r($arResult); ?>
</pre>
<div class="content">
    <div class="app-container">
        <h1 class="text-lg font-montserrat page-title">
        	<span class="page-title__text">Нам нужен</span>
                <span class="h1 page-title__element ">
                    <?if(!empty($arResult["NAME"])):?>
						<? echo $arResult["NAME"];?>
					<?endif;?>	
				</span>
        </h1>
        <div class="page-content-columns content-columns">
            <div class="content-column">
            	<div class="text-lg vacancy-send-text">Отправляйте резюме<br>по электронному адресу:</div>
	            	<a href="mailto:abakan@edin.center" class="h2">info@dod-ru.ru</a>
            	</div>
            <div class="content-column">
				<section class="vacancy-section">
					<h2 class="font-montserrat text-lg">Обязанности:</h2>
						<ul class="ul">
							<?
								if($arResult["DETAIL_TEXT"] <> ''):

									$new_arr = array();
									$text = explode("`", $arResult['DETAIL_TEXT']);
									for($i=0; $i<count($text); $i++)
									{
										$vol = strip_tags(trim($text[$i]));

										echo "<li>" . $vol . "</li>";
									}

								endif;
							?>
																	
						</ul>
				</section>
				<section class="vacancy-section">
					<h2 class="font-montserrat text-lg">Требования:</h2>
						<ul class="ul">
							<?
								if($arResult["PREVIEW_TEXT"] <> ''):

									$new_arr = array();
									$text = explode("`", $arResult["PREVIEW_TEXT"]);
									for($i=0; $i<count($text); $i++)
									{
										$vol = strip_tags(trim($text[$i]));
										echo "<li>" . htmlspecialchars(trim($vol)) . "</li>";
									}

								endif;
							?>				
						</ul>
				</section>
				<section class="vacancy-section">
					<h2 class="font-montserrat text-lg">Условия:</h2>
					<ul class="ul">
						<?
							foreach ($arResult["PROPERTIES"] as $pid => $arProperty):
								if(trim($arProperty["NAME"])=="conditions"):
									$text = explode("`", $arProperty["VALUE"]["TEXT"]);
									for($i=0; $i<count($text); $i++)
									{
										$vol = strip_tags(trim($text[$i]));
										echo "<li>" . htmlspecialchars(trim($vol)) . "</li>";
									}
								endif;
							endforeach;
						?>	
					</ul>
				</section>
			</div>
        </div>
    </div>
</div>