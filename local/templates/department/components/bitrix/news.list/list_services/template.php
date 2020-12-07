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
	<ul class="services-list scroll-lock js-services-list" id="<?=$this->GetEditAreaId($arItem['ID']);?>">
	<? foreach ($arResult['ITEMS'] as $arItem): ?>
		
			<?
				$this->AddEditAction($arItem['ID'], $arItem['EDIT_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_EDIT"));
				$this->AddDeleteAction($arItem['ID'], $arItem['DELETE_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_DELETE"), array("CONFIRM" => GetMessage('CT_BNL_ELEMENT_DELETE_CONFIRM')));
			?>
			<? if (!empty($arItem["PREVIEW_PICTURE"]["SRC"])): ?>
				<li class="services-list__item js-services-item" data-bg="<?=$arItem["PREVIEW_PICTURE"]["SRC"]?>">
					<div class="services-list__title">
						<?= isset($arItem["NAME"]) ? $arItem["NAME"] : ''?>									
					</div>
					<div class="services-list__descr">
						<?= isset($arItem["PREVIEW_TEXT"]) ? $arItem["PREVIEW_TEXT"] : ''?>
					</div>
					<img data-src="<?=$arItem["PREVIEW_PICTURE"]["SRC"]?>" alt="<?=$arItem["NAME"]?>" title="<?=$arItem["NAME"]?>" class="services-list__img lazy">
				</li>
			<? endif; ?>
	<? endforeach; ?>
	</ul>
<? endif; ?>