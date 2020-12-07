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
<? if (!empty($arResult['ITEMS'])): ?>
	<ul class="list-unstyled lines-list" id="<?=$this->GetEditAreaId($arItem['ID']);?>">
	<? foreach ($arResult['ITEMS'] as $arItem): ?>
			<?
				$this->AddEditAction($arItem['ID'], $arItem['EDIT_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_EDIT"));
				$this->AddDeleteAction($arItem['ID'], $arItem['DELETE_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_DELETE"), array("CONFIRM" => GetMessage('CT_BNL_ELEMENT_DELETE_CONFIRM')));
			?>
			<? if (!empty($arItem["PREVIEW_PICTURE"]["SRC"])): ?>
				<li class="lines-list-item lines-list-item--no-border">
				    <div class="lines-item vacancy-item team-item">
				        <div class="vacancy__img">
				            <img class="lazy" data-src="<?=$arItem["PREVIEW_PICTURE"]["SRC"]?>" alt="">
				        </div>
				       	<h3 class="vacancy__title"><?=isset($arItem["NAME"]) ? $arItem["NAME"] : ''?></h3>
				        <p class="vacancy__descr"><?=isset($arItem["PREVIEW_TEXT"]) ? $arItem["PREVIEW_TEXT"] : ''?></p>
				    </div>
				</li>
			<? endif; ?>

	<? endforeach; ?>
	</ul>
<? endif; ?>
