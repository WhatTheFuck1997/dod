<?if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();?>

<? if (!empty($arResult)): ?>

		<? foreach ($arResult as $item): ?>
			<li class="nav-list__item js-entering__nav-item">
				<a href="<?= $item['LINK'] ?>" class="nav__link js-nav__link" data-transition="dark"><?= $item['TEXT'] ?></a>
			</li>
		<? endforeach; ?>

<? endif; ?>