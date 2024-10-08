import React, { FC, FormEvent, useState } from 'react';
import { ZekrIndex } from '../../services/Zekr/models/Zekr';
import { searchZekrIndex } from '../../services/Zekr/ZekrSearch';
import { ZekrList } from '../ZekrList/ZekrList';

interface Props {
	textBoxId: string;
	zekrList: ZekrIndex[];
	sectionTitle: string;
	displaySearchInputLimit?: number;
	displayRemoveButton?: boolean;
	onRemoveClick?: (zekr: ZekrIndex) => void;
}

export const ZekrListSearchable: FC<Props> = ({
	textBoxId,
	zekrList,
	sectionTitle,
	displaySearchInputLimit,
	displayRemoveButton,
	onRemoveClick,
}) => {
	const searchResultLimit: number = 20;
	const [searchText, setSearchText] = useState<string>('');
	const [zekrSearchResult, setZekrSearchResult] = useState<ZekrIndex[] | null>();

	if (!displaySearchInputLimit) {
		// default limit to show search box
		displaySearchInputLimit = 15;
	}

	var searchTimeout: NodeJS.Timeout;
	function onSearchInput(event: FormEvent<HTMLInputElement>) {
		event.preventDefault();

		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}
		searchTimeout = setTimeout(doSearch, 250);
	}
	function onSearchChange() {
		doSearch();
	}

	function onSearchInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key == 'Enter') {
			doSearch();
			document.getElementById(textBoxId)?.blur();

			var items = document.getElementsByClassName('item-button');
			if (items.length) {
				(items[0] as HTMLInputElement).focus();
			}
		}
	}
	function onSearchIconClick() {
		doSearch();
	}
	function doSearch() {
		var val = (document.getElementById(textBoxId) as HTMLInputElement).value;
		if (!val) {
			setSearchText(val);
			setZekrSearchResult(null);
			return;
		}

		var searchResult = searchZekrIndex(zekrList, val, searchResultLimit);
		setZekrSearchResult(searchResult);
		setSearchText(val);
	}

	return (
		<section className="main-section">
			<h3 className="main-section-title title-with-tools">
				<span className="no-wrap">{sectionTitle}</span>
				{zekrList.length > displaySearchInputLimit && (
					<div className="input-group input-group-sm search-input">
						<input
							id={textBoxId}
							type="text"
							className="form-control"
							aria-describedby="zekrlist-search-input"
							placeholder="جستجو در این اذکار"
							onInput={onSearchInput}
							onChange={onSearchChange}
							onKeyDown={onSearchInputKeyDown}
						/>
						<button
							className="btn btn-outline-secondary button-icon"
							type="button"
							id="zekrlist-search-input"
							onClick={onSearchIconClick}
						>
							<span role="img">🔍</span>
						</button>
					</div>
				)}
			</h3>
			<div className="">
				{searchText && !zekrSearchResult?.length && (
					<div className="">متاسفانه نتیجه ای یافت نشد. با کلمات کوتاه تر امتحان کنید.</div>
				)}
				{!searchText && !zekrList.length && <div>هیچ ذکری یافت نشد</div>}
				{(zekrSearchResult?.length || zekrList.length > 0) && (
					<ZekrList
						data={zekrSearchResult || zekrList}
						displayRemoveButton={displayRemoveButton}
						onRemoveClick={onRemoveClick}
					/>
				)}
			</div>
		</section>
	);
};
