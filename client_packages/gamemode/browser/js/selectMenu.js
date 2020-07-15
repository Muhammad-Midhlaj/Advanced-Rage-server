$(document).ready(() => {
	const MAX_ITEMS_COUNT = 5; // максимально количество отображаемых пунктов в меню
	window.currentMenu = null;
	const ITEM_HEIGHT = 4;
	var test = [255];
	for (var i = 1; i < 100; i++) test.push(i + "");

	function onEnterBizHandler(menuName, values) {
		if (!values) return;
		var isOwner = values.isOwner || false;
		var owner = values.owner || 0;
		var items = menus[menuName].items;
		if (items[items.length - 1].text == "Control Panel") items.splice(items.length - 1, 1);
		if (items[items.length - 1].text == "Buy business") items.splice(items.length - 1, 1);
		if (isOwner) {
			items.push({
				text: "Control Panel"
			});
		} else {
			if (!owner) items.push({
				text: "Buy business"
			});
		}

		infoTableAPI.hide();
	}

	var menuItems = {

	};

	var menus = {
		"test": {
			header: "Top menu",
			location: "left-middle",
			items: [{
					text: 'Ordinary type'
				},
				{
					text: 'Custom type',
					values: ['Selection 1', 'Selection 2', 'Selection 3']
				},
				{
					text: 'Custom type',
					values: ['Selection 1', 'Selection 2', 'Selection 3']
				},
				{
					text: 'Color selection',
					type: "choice-color",
					values: ['#0bf', '#fb0', '#bf0']
				},
				{
					text: 'Color selection',
					type: "choice-color",
					values: ['#bf0', '#0bf', '#fb0']
				}
			]
		},
		"character_main": {
			header: "Character",
			location: "left-middle-upper",
			items: [
				{
					text: "Name",
					placeholder: "Name",
					type: "text-field"
				},
				{
					text: "Surname",
					placeholder: "Surname",
					type: "text-field"
				},
				{
					text: "Genre",
					values: ["Male", "Female"]
				},
				{
					text: "Heredity"
				},
				{
					text: "Characteristics"
				},
				{
					text: "Appearance"
				},
				{
					text: "Clothing"
				},
				{
					text: "Next"
				}
			],
			prompt: "Create a character.",
			logo: true,
			maxItemsCount: 6,
		},
		"character_parents": {
			header: "Heredity",
			location: "left-middle-upper",
			items: [{
					text: "Mother",
					values: [ "Hannah", "Audrey", "Jasmine", "Giselle", "Amelia",
						"Isabella", "Zoe", "Eva", "Camilla", "Violetta", "Sofia",
						"Evelyn", "Nicole", "Ashley", "Grace", "Brianna", "Natalie",
						"Olivia", "Elizabeth", "Charlotte", "Emma", "Misty"
					]
				},
				{
					text: "Father",
					values: [ "Benjamin", "Daniel", "Joshua", "Noah", "Andrew",
						"Juan", "Alex", "Isaac", "Evan", "Ethan", "Vincent", "Angel",
						"Diego", "Adrian", "Gabriel", "Michael", "Santiago", "Kevin",
						"Lewis", "Samuel", "Anthony", "Claude", "John", "Nico"
					]
				},
				{
					text: "Similarity",
					// values: ["100% с мамой", "75% с мамой", "50%", "75% с папой", "100% с папой"],
					values: [ "0%", "2%", "4%", "6%", "8%", "10%", "12%", "14%", "16%", "18%", "20%", "22%", "24%",
						"26%", "28%", "30%", "32%", "34%", "36%", "38%", "40%", "42%", "44%", "46%", "48%", "50%", "52%",
						"54%", "56%", "58%", "60%", "62%", "64%", "66%", "68%", "70%", "72%", "74%", "76%", "78%", "80%",
						"82%", "84%", "86%", "88%", "90%", "92%", "94%", "96%", "98%", "100%" ]
					,
					valueIndex: 25
				},
				{
					text: "Skin color",
					/* values: ['#c59a7c', '#e7cbaf', '#ffd7a6', '#f2dbcd', '#906a5f'],
					type: "choice-color" */
					values: [ "0%", "2%", "4%", "6%", "8%", "10%", "12%", "14%", "16%", "18%", "20%", "22%", "24%",
						"26%", "28%", "30%", "32%", "34%", "36%", "38%", "40%", "42%", "44%", "46%", "48%", "50%", "52%",
						"54%", "56%", "58%", "60%", "62%", "64%", "66%", "68%", "70%", "72%", "74%", "76%", "78%", "80%",
						"82%", "84%", "86%", "88%", "90%", "92%", "94%", "96%", "98%", "100%" ]
					,
					valueIndex: 25
				},
				/* {
					text: "Характер",
					values: ['Триатлонист', 'Бодибилдер', 'Снайпер', 'Ниндзя', 'Ас', 'Гонщик', 'Нормальный']
				}, */
				{
					text: "Back"
				}
			],
			prompt: "Choose heredity.",
			on: () => {
				$(`.selectMenu .family-preview`).show();
			},
			logo: true,
		},
		"character_faceFeatures": {
			header: "Characteristics",
			location: "left-middle-upper",
			prompt: "Change the appearance.",
			logo: true,
			maxItemsCount: 10,
			items: [
				// valueIndex
				{ text: "Nose width", values: [ "0%", "1%", "2%", "3%", "4%", "5%", "6%", "7%", "8%", "9%", "10%", "11%", "12%", "13%", "14%", "15%", "16%", "17%", "18%", "19%", "20%", "21%", "22%", "23%", "24%", "25%", "26%", "27%", "28%", "29%", "30%", "31%", "32%", "33%", "34%", "35%", "36%", "37%", "38%", "39%", "40%", "41%", "42%", "43%", "44%", "45%", "46%", "47%", "48%", "49%", "50%", "51%", "52%", "53%", "54%", "55%", "56%", "57%", "58%", "59%", "60%", "61%", "62%", "63%", "64%", "65%", "66%", "67%", "68%", "69%", "70%", "71%", "72%", "73%", "74%", "75%", "76%", "77%", "78%", "79%", "80%", "81%", "82%", "83%", "84%", "85%", "86%", "87%", "88%", "89%", "90%", "91%", "92%", "93%", "94%", "95%", "96%", "97%", "98%", "99%", "100%" ], valueIndex: 50 },
				{ text: "Nose position", values: [ "0%", "1%", "2%", "3%", "4%", "5%", "6%", "7%", "8%", "9%", "10%", "11%", "12%", "13%", "14%", "15%", "16%", "17%", "18%", "19%", "20%", "21%", "22%", "23%", "24%", "25%", "26%", "27%", "28%", "29%", "30%", "31%", "32%", "33%", "34%", "35%", "36%", "37%", "38%", "39%", "40%", "41%", "42%", "43%", "44%", "45%", "46%", "47%", "48%", "49%", "50%", "51%", "52%", "53%", "54%", "55%", "56%", "57%", "58%", "59%", "60%", "61%", "62%", "63%", "64%", "65%", "66%", "67%", "68%", "69%", "70%", "71%", "72%", "73%", "74%", "75%", "76%", "77%", "78%", "79%", "80%", "81%", "82%", "83%", "84%", "85%", "86%", "87%", "88%", "89%", "90%", "91%", "92%", "93%", "94%", "95%", "96%", "97%", "98%", "99%", "100%" ], valueIndex: 50 },
				{ text: "Nose length", values: [ "0%", "1%", "2%", "3%", "4%", "5%", "6%", "7%", "8%", "9%", "10%", "11%", "12%", "13%", "14%", "15%", "16%", "17%", "18%", "19%", "20%", "21%", "22%", "23%", "24%", "25%", "26%", "27%", "28%", "29%", "30%", "31%", "32%", "33%", "34%", "35%", "36%", "37%", "38%", "39%", "40%", "41%", "42%", "43%", "44%", "45%", "46%", "47%", "48%", "49%", "50%", "51%", "52%", "53%", "54%", "55%", "56%", "57%", "58%", "59%", "60%", "61%", "62%", "63%", "64%", "65%", "66%", "67%", "68%", "69%", "70%", "71%", "72%", "73%", "74%", "75%", "76%", "77%", "78%", "79%", "80%", "81%", "82%", "83%", "84%", "85%", "86%", "87%", "88%", "89%", "90%", "91%", "92%", "93%", "94%", "95%", "96%", "97%", "98%", "99%", "100%" ], valueIndex: 50 },
				{ text: "Carrier", values: [ "0%", "1%", "2%", "3%", "4%", "5%", "6%", "7%", "8%", "9%", "10%", "11%", "12%", "13%", "14%", "15%", "16%", "17%", "18%", "19%", "20%", "21%", "22%", "23%", "24%", "25%", "26%", "27%", "28%", "29%", "30%", "31%", "32%", "33%", "34%", "35%", "36%", "37%", "38%", "39%", "40%", "41%", "42%", "43%", "44%", "45%", "46%", "47%", "48%", "49%", "50%", "51%", "52%", "53%", "54%", "55%", "56%", "57%", "58%", "59%", "60%", "61%", "62%", "63%", "64%", "65%", "66%", "67%", "68%", "69%", "70%", "71%", "72%", "73%", "74%", "75%", "76%", "77%", "78%", "79%", "80%", "81%", "82%", "83%", "84%", "85%", "86%", "87%", "88%", "89%", "90%", "91%", "92%", "93%", "94%", "95%", "96%", "97%", "98%", "99%", "100%" ], valueIndex: 50 },
				{ text: "The tip of the nose", values: [ "0%", "1%", "2%", "3%", "4%", "5%", "6%", "7%", "8%", "9%", "10%", "11%", "12%", "13%", "14%", "15%", "16%", "17%", "18%", "19%", "20%", "21%", "22%", "23%", "24%", "25%", "26%", "27%", "28%", "29%", "30%", "31%", "32%", "33%", "34%", "35%", "36%", "37%", "38%", "39%", "40%", "41%", "42%", "43%", "44%", "45%", "46%", "47%", "48%", "49%", "50%", "51%", "52%", "53%", "54%", "55%", "56%", "57%", "58%", "59%", "60%", "61%", "62%", "63%", "64%", "65%", "66%", "67%", "68%", "69%", "70%", "71%", "72%", "73%", "74%", "75%", "76%", "77%", "78%", "79%", "80%", "81%", "82%", "83%", "84%", "85%", "86%", "87%", "88%", "89%", "90%", "91%", "92%", "93%", "94%", "95%", "96%", "97%", "98%", "99%", "100%" ], valueIndex: 50 },
				{ text: "Shifting the nose", values: [ "0%", "1%", "2%", "3%", "4%", "5%", "6%", "7%", "8%", "9%", "10%", "11%", "12%", "13%", "14%", "15%", "16%", "17%", "18%", "19%", "20%", "21%", "22%", "23%", "24%", "25%", "26%", "27%", "28%", "29%", "30%", "31%", "32%", "33%", "34%", "35%", "36%", "37%", "38%", "39%", "40%", "41%", "42%", "43%", "44%", "45%", "46%", "47%", "48%", "49%", "50%", "51%", "52%", "53%", "54%", "55%", "56%", "57%", "58%", "59%", "60%", "61%", "62%", "63%", "64%", "65%", "66%", "67%", "68%", "69%", "70%", "71%", "72%", "73%", "74%", "75%", "76%", "77%", "78%", "79%", "80%", "81%", "82%", "83%", "84%", "85%", "86%", "87%", "88%", "89%", "90%", "91%", "92%", "93%", "94%", "95%", "96%", "97%", "98%", "99%", "100%" ], valueIndex: 50 },
				{ text: "The height of the forehead", values: [ "0%", "1%", "2%", "3%", "4%", "5%", "6%", "7%", "8%", "9%", "10%", "11%", "12%", "13%", "14%", "15%", "16%", "17%", "18%", "19%", "20%", "21%", "22%", "23%", "24%", "25%", "26%", "27%", "28%", "29%", "30%", "31%", "32%", "33%", "34%", "35%", "36%", "37%", "38%", "39%", "40%", "41%", "42%", "43%", "44%", "45%", "46%", "47%", "48%", "49%", "50%", "51%", "52%", "53%", "54%", "55%", "56%", "57%", "58%", "59%", "60%", "61%", "62%", "63%", "64%", "65%", "66%", "67%", "68%", "69%", "70%", "71%", "72%", "73%", "74%", "75%", "76%", "77%", "78%", "79%", "80%", "81%", "82%", "83%", "84%", "85%", "86%", "87%", "88%", "89%", "90%", "91%", "92%", "93%", "94%", "95%", "96%", "97%", "98%", "99%", "100%" ], valueIndex: 50 },
				{ text: "The shape of the forehead", values: [ "0%", "1%", "2%", "3%", "4%", "5%", "6%", "7%", "8%", "9%", "10%", "11%", "12%", "13%", "14%", "15%", "16%", "17%", "18%", "19%", "20%", "21%", "22%", "23%", "24%", "25%", "26%", "27%", "28%", "29%", "30%", "31%", "32%", "33%", "34%", "35%", "36%", "37%", "38%", "39%", "40%", "41%", "42%", "43%", "44%", "45%", "46%", "47%", "48%", "49%", "50%", "51%", "52%", "53%", "54%", "55%", "56%", "57%", "58%", "59%", "60%", "61%", "62%", "63%", "64%", "65%", "66%", "67%", "68%", "69%", "70%", "71%", "72%", "73%", "74%", "75%", "76%", "77%", "78%", "79%", "80%", "81%", "82%", "83%", "84%", "85%", "86%", "87%", "88%", "89%", "90%", "91%", "92%", "93%", "94%", "95%", "96%", "97%", "98%", "99%", "100%" ], valueIndex: 50 },
				{ text: "The position of the cheekbones", values: [ "0%", "1%", "2%", "3%", "4%", "5%", "6%", "7%", "8%", "9%", "10%", "11%", "12%", "13%", "14%", "15%", "16%", "17%", "18%", "19%", "20%", "21%", "22%", "23%", "24%", "25%", "26%", "27%", "28%", "29%", "30%", "31%", "32%", "33%", "34%", "35%", "36%", "37%", "38%", "39%", "40%", "41%", "42%", "43%", "44%", "45%", "46%", "47%", "48%", "49%", "50%", "51%", "52%", "53%", "54%", "55%", "56%", "57%", "58%", "59%", "60%", "61%", "62%", "63%", "64%", "65%", "66%", "67%", "68%", "69%", "70%", "71%", "72%", "73%", "74%", "75%", "76%", "77%", "78%", "79%", "80%", "81%", "82%", "83%", "84%", "85%", "86%", "87%", "88%", "89%", "90%", "91%", "92%", "93%", "94%", "95%", "96%", "97%", "98%", "99%", "100%" ], valueIndex: 50 },
				{ text: "The shape of the cheekbones", values: [ "0%", "1%", "2%", "3%", "4%", "5%", "6%", "7%", "8%", "9%", "10%", "11%", "12%", "13%", "14%", "15%", "16%", "17%", "18%", "19%", "20%", "21%", "22%", "23%", "24%", "25%", "26%", "27%", "28%", "29%", "30%", "31%", "32%", "33%", "34%", "35%", "36%", "37%", "38%", "39%", "40%", "41%", "42%", "43%", "44%", "45%", "46%", "47%", "48%", "49%", "50%", "51%", "52%", "53%", "54%", "55%", "56%", "57%", "58%", "59%", "60%", "61%", "62%", "63%", "64%", "65%", "66%", "67%", "68%", "69%", "70%", "71%", "72%", "73%", "74%", "75%", "76%", "77%", "78%", "79%", "80%", "81%", "82%", "83%", "84%", "85%", "86%", "87%", "88%", "89%", "90%", "91%", "92%", "93%", "94%", "95%", "96%", "97%", "98%", "99%", "100%" ], valueIndex: 50 },
				{ text: "Cheeks", values: [ "0%", "1%", "2%", "3%", "4%", "5%", "6%", "7%", "8%", "9%", "10%", "11%", "12%", "13%", "14%", "15%", "16%", "17%", "18%", "19%", "20%", "21%", "22%", "23%", "24%", "25%", "26%", "27%", "28%", "29%", "30%", "31%", "32%", "33%", "34%", "35%", "36%", "37%", "38%", "39%", "40%", "41%", "42%", "43%", "44%", "45%", "46%", "47%", "48%", "49%", "50%", "51%", "52%", "53%", "54%", "55%", "56%", "57%", "58%", "59%", "60%", "61%", "62%", "63%", "64%", "65%", "66%", "67%", "68%", "69%", "70%", "71%", "72%", "73%", "74%", "75%", "76%", "77%", "78%", "79%", "80%", "81%", "82%", "83%", "84%", "85%", "86%", "87%", "88%", "89%", "90%", "91%", "92%", "93%", "94%", "95%", "96%", "97%", "98%", "99%", "100%" ], valueIndex: 50 },
				{ text: "Eyes", values: [ "0%", "1%", "2%", "3%", "4%", "5%", "6%", "7%", "8%", "9%", "10%", "11%", "12%", "13%", "14%", "15%", "16%", "17%", "18%", "19%", "20%", "21%", "22%", "23%", "24%", "25%", "26%", "27%", "28%", "29%", "30%", "31%", "32%", "33%", "34%", "35%", "36%", "37%", "38%", "39%", "40%", "41%", "42%", "43%", "44%", "45%", "46%", "47%", "48%", "49%", "50%", "51%", "52%", "53%", "54%", "55%", "56%", "57%", "58%", "59%", "60%", "61%", "62%", "63%", "64%", "65%", "66%", "67%", "68%", "69%", "70%", "71%", "72%", "73%", "74%", "75%", "76%", "77%", "78%", "79%", "80%", "81%", "82%", "83%", "84%", "85%", "86%", "87%", "88%", "89%", "90%", "91%", "92%", "93%", "94%", "95%", "96%", "97%", "98%", "99%", "100%" ], valueIndex: 50 },
				{ text: "Lips", values: [ "0%", "1%", "2%", "3%", "4%", "5%", "6%", "7%", "8%", "9%", "10%", "11%", "12%", "13%", "14%", "15%", "16%", "17%", "18%", "19%", "20%", "21%", "22%", "23%", "24%", "25%", "26%", "27%", "28%", "29%", "30%", "31%", "32%", "33%", "34%", "35%", "36%", "37%", "38%", "39%", "40%", "41%", "42%", "43%", "44%", "45%", "46%", "47%", "48%", "49%", "50%", "51%", "52%", "53%", "54%", "55%", "56%", "57%", "58%", "59%", "60%", "61%", "62%", "63%", "64%", "65%", "66%", "67%", "68%", "69%", "70%", "71%", "72%", "73%", "74%", "75%", "76%", "77%", "78%", "79%", "80%", "81%", "82%", "83%", "84%", "85%", "86%", "87%", "88%", "89%", "90%", "91%", "92%", "93%", "94%", "95%", "96%", "97%", "98%", "99%", "100%" ], valueIndex: 50 },
				{ text: "Jaw width", values: [ "0%", "1%", "2%", "3%", "4%", "5%", "6%", "7%", "8%", "9%", "10%", "11%", "12%", "13%", "14%", "15%", "16%", "17%", "18%", "19%", "20%", "21%", "22%", "23%", "24%", "25%", "26%", "27%", "28%", "29%", "30%", "31%", "32%", "33%", "34%", "35%", "36%", "37%", "38%", "39%", "40%", "41%", "42%", "43%", "44%", "45%", "46%", "47%", "48%", "49%", "50%", "51%", "52%", "53%", "54%", "55%", "56%", "57%", "58%", "59%", "60%", "61%", "62%", "63%", "64%", "65%", "66%", "67%", "68%", "69%", "70%", "71%", "72%", "73%", "74%", "75%", "76%", "77%", "78%", "79%", "80%", "81%", "82%", "83%", "84%", "85%", "86%", "87%", "88%", "89%", "90%", "91%", "92%", "93%", "94%", "95%", "96%", "97%", "98%", "99%", "100%" ], valueIndex: 50 },
				{ text: "Jaw shape", values: [ "0%", "1%", "2%", "3%", "4%", "5%", "6%", "7%", "8%", "9%", "10%", "11%", "12%", "13%", "14%", "15%", "16%", "17%", "18%", "19%", "20%", "21%", "22%", "23%", "24%", "25%", "26%", "27%", "28%", "29%", "30%", "31%", "32%", "33%", "34%", "35%", "36%", "37%", "38%", "39%", "40%", "41%", "42%", "43%", "44%", "45%", "46%", "47%", "48%", "49%", "50%", "51%", "52%", "53%", "54%", "55%", "56%", "57%", "58%", "59%", "60%", "61%", "62%", "63%", "64%", "65%", "66%", "67%", "68%", "69%", "70%", "71%", "72%", "73%", "74%", "75%", "76%", "77%", "78%", "79%", "80%", "81%", "82%", "83%", "84%", "85%", "86%", "87%", "88%", "89%", "90%", "91%", "92%", "93%", "94%", "95%", "96%", "97%", "98%", "99%", "100%" ], valueIndex: 50 },
				{ text: "Chin length", values: [ "0%", "1%", "2%", "3%", "4%", "5%", "6%", "7%", "8%", "9%", "10%", "11%", "12%", "13%", "14%", "15%", "16%", "17%", "18%", "19%", "20%", "21%", "22%", "23%", "24%", "25%", "26%", "27%", "28%", "29%", "30%", "31%", "32%", "33%", "34%", "35%", "36%", "37%", "38%", "39%", "40%", "41%", "42%", "43%", "44%", "45%", "46%", "47%", "48%", "49%", "50%", "51%", "52%", "53%", "54%", "55%", "56%", "57%", "58%", "59%", "60%", "61%", "62%", "63%", "64%", "65%", "66%", "67%", "68%", "69%", "70%", "71%", "72%", "73%", "74%", "75%", "76%", "77%", "78%", "79%", "80%", "81%", "82%", "83%", "84%", "85%", "86%", "87%", "88%", "89%", "90%", "91%", "92%", "93%", "94%", "95%", "96%", "97%", "98%", "99%", "100%" ], valueIndex: 50 },
				{ text: "Chin position", values: [ "0%", "1%", "2%", "3%", "4%", "5%", "6%", "7%", "8%", "9%", "10%", "11%", "12%", "13%", "14%", "15%", "16%", "17%", "18%", "19%", "20%", "21%", "22%", "23%", "24%", "25%", "26%", "27%", "28%", "29%", "30%", "31%", "32%", "33%", "34%", "35%", "36%", "37%", "38%", "39%", "40%", "41%", "42%", "43%", "44%", "45%", "46%", "47%", "48%", "49%", "50%", "51%", "52%", "53%", "54%", "55%", "56%", "57%", "58%", "59%", "60%", "61%", "62%", "63%", "64%", "65%", "66%", "67%", "68%", "69%", "70%", "71%", "72%", "73%", "74%", "75%", "76%", "77%", "78%", "79%", "80%", "81%", "82%", "83%", "84%", "85%", "86%", "87%", "88%", "89%", "90%", "91%", "92%", "93%", "94%", "95%", "96%", "97%", "98%", "99%", "100%" ], valueIndex: 50 },
				{ text: "Chin width", values: [ "0%", "1%", "2%", "3%", "4%", "5%", "6%", "7%", "8%", "9%", "10%", "11%", "12%", "13%", "14%", "15%", "16%", "17%", "18%", "19%", "20%", "21%", "22%", "23%", "24%", "25%", "26%", "27%", "28%", "29%", "30%", "31%", "32%", "33%", "34%", "35%", "36%", "37%", "38%", "39%", "40%", "41%", "42%", "43%", "44%", "45%", "46%", "47%", "48%", "49%", "50%", "51%", "52%", "53%", "54%", "55%", "56%", "57%", "58%", "59%", "60%", "61%", "62%", "63%", "64%", "65%", "66%", "67%", "68%", "69%", "70%", "71%", "72%", "73%", "74%", "75%", "76%", "77%", "78%", "79%", "80%", "81%", "82%", "83%", "84%", "85%", "86%", "87%", "88%", "89%", "90%", "91%", "92%", "93%", "94%", "95%", "96%", "97%", "98%", "99%", "100%" ], valueIndex: 50 },
				{ text: "The shape of the chin", values: [ "0%", "1%", "2%", "3%", "4%", "5%", "6%", "7%", "8%", "9%", "10%", "11%", "12%", "13%", "14%", "15%", "16%", "17%", "18%", "19%", "20%", "21%", "22%", "23%", "24%", "25%", "26%", "27%", "28%", "29%", "30%", "31%", "32%", "33%", "34%", "35%", "36%", "37%", "38%", "39%", "40%", "41%", "42%", "43%", "44%", "45%", "46%", "47%", "48%", "49%", "50%", "51%", "52%", "53%", "54%", "55%", "56%", "57%", "58%", "59%", "60%", "61%", "62%", "63%", "64%", "65%", "66%", "67%", "68%", "69%", "70%", "71%", "72%", "73%", "74%", "75%", "76%", "77%", "78%", "79%", "80%", "81%", "82%", "83%", "84%", "85%", "86%", "87%", "88%", "89%", "90%", "91%", "92%", "93%", "94%", "95%", "96%", "97%", "98%", "99%", "100%" ], valueIndex: 50 },
				{ text: "Neck", values: [ "0%", "1%", "2%", "3%", "4%", "5%", "6%", "7%", "8%", "9%", "10%", "11%", "12%", "13%", "14%", "15%", "16%", "17%", "18%", "19%", "20%", "21%", "22%", "23%", "24%", "25%", "26%", "27%", "28%", "29%", "30%", "31%", "32%", "33%", "34%", "35%", "36%", "37%", "38%", "39%", "40%", "41%", "42%", "43%", "44%", "45%", "46%", "47%", "48%", "49%", "50%", "51%", "52%", "53%", "54%", "55%", "56%", "57%", "58%", "59%", "60%", "61%", "62%", "63%", "64%", "65%", "66%", "67%", "68%", "69%", "70%", "71%", "72%", "73%", "74%", "75%", "76%", "77%", "78%", "79%", "80%", "81%", "82%", "83%", "84%", "85%", "86%", "87%", "88%", "89%", "90%", "91%", "92%", "93%", "94%", "95%", "96%", "97%", "98%", "99%", "100%" ], valueIndex: 50 },
				{ text: "Back" }
			]
		},
		"character_look": {
			header: "Appearance",
			location: "left-middle-upper",
			items: [],
			prompt: "Change the look.",
			logo: true,
			maxItemsCount: 10,
		},
		"character_clothes": {
			header: "Clothing",
			location: "left-middle-upper",
			items: [],
			prompt: "Choose clothes.",
			logo: true,
		},
		"!enter_house": {
			header: "House",
			location: "left-top",
			items: [{
					text: "Enter the house"
				},
				{
					text: "Call the bell"
				},
				{
					text: "Home information"
				},
				{
					text: "Close"
				},
			],
			on: () => {
				infoTableAPI.hide();
			},
		},
		"!exit_house": {
			header: "The door",
			location: "left-top",
			items: [{
					text: "Go outside"
				},
				{
					text: "Close"
				},
			],
			on: () => {
				infoTableAPI.hide();
			},
		},
		/*"enter_garage": {
			  header: "Гараж",
			  location: "left-top",
			  items: [
					{text: "Войти в гараж"},
					{text: "Постучать в дверь гаража"},
					{text: "Information о гараже"},
					{text: "Close"},
			  ],
			  on: () => {
					infoTableAPI.hide();
			  },
		},
		"exit_garage": {
			  header: "The door",
			  location: "left-top",
			  items: [
					{text: "Выйти в дом"},
					{text: "Go outside"},
					{text: "Close"},
			  ],
			  on: () => {
					infoTableAPI.hide();
			  },
		},*/
		"enter_biz_1": {
			header: "Diner",
			location: "right-middle",
			items: [{
					text: "Item 1"
				},
				{
					text: "Item 2"
				},
				{
					text: "Item 3"
				},
			],
			on: (values) => {
				onEnterBizHandler("enter_biz_1", values);
			},
		},
		"enter_biz_2": {
			header: "Бар",
			location: "right-middle",
			items: [{
					text: "Item 1"
				},
				{
					text: "Item 2"
				},
				{
					text: "Item 3"
				},
			],
			on: (values) => {
				onEnterBizHandler("enter_biz_2", values);
			},
		},

		"enter_biz_3": {
			header: "Clothing store",
			logo: true,
			location: "right-middle",
			items: [{
				text: "Dressing room"
			}],
			on: (values) => {
				onEnterBizHandler("enter_biz_3", values);
			},
		},
		"biz_3_clothes": {
			header: "Dressing room",
			logo: true,
			location: "right-middle",
			items: [{
					text: "Outerwear"
				},
				{
					text: "Underwear"
				},
				{
					text: "Shoes"
				},
				{
					text: "Hats"
				},
				{
					text: "Glasses"
				},
				{
					text: "Bracelets"
				},
				{
					text: "Earrings"
				},
				// {
				// 	text: "Mask"
				// },
				{
					text: "Accessories"
				},
				{
					text: "Watch"
				},
				{
					text: "Back"
				},
			]
		},
		"biz_3_top": {
			header: "Outerwear",
			logo: true,
			location: "right-middle",
			items: [{
				text: "Filled with script...."
			}]
		},
		"biz_3_legs": {
			header: "Underwear",
			logo: true,
			location: "right-middle",
			items: [{
				text: "Filled with script...."
			}]
		},
		"biz_3_feets": {
			header: "Shoes",
			logo: true,
			location: "right-middle",
			items: [{
				text: "Filled with script...."
			}]
		},
		"biz_3_hats": {
			header: "Hats",
			logo: true,
			location: "right-middle",
			items: [{
				text: "Filled with script...."
			}]
		},
		"biz_3_glasses": {
			header: "Glasses",
			logo: true,
			location: "right-middle",
			items: [{
				text: "Filled with script...."
			}]
		},
		"biz_3_bracelets": {
			header: "Bracelets",
			logo: true,
			location: "right-middle",
			items: [{
				text: "Filled with script...."
			}]
		},
		"biz_3_ears": {
			header: "Earrings",
			logo: true,
			location: "right-middle",
			items: [{
				text: "Filled with script...."
			}]
		},
		"biz_3_masks": {
			header: "Mask",
			logo: true,
			location: "right-middle",
			items: [{
				text: "Filled with script...."
			}]
		},
		"biz_3_ties": {
			header: "Accessories",
			logo: true,
			location: "right-middle",
			items: [{
				text: "Filled with script...."
			}]
		},
		"biz_3_watches": {
			header: "Watch",
			logo: true,
			location: "right-middle",
			items: [{
				text: "Filled with script...."
			}]
		},
		"enter_biz_4": {
			header: "Barbershop",
			location: "right-middle",
			items: [{
					text: "Item 1"
				},
				{
					text: "Item 2"
				},
				{
					text: "Item 3"
				},
			],
			on: (values) => {
				onEnterBizHandler("enter_biz_4", values);
			},
		},
		"enter_biz_5": {
			header: "Petrol station",
			location: "right-middle",
			items: [{
				text: "Fuel",
			}, ],
			on: (values) => {
				onEnterBizHandler("enter_biz_5", values);
			},
		},
		"biz_5_items": {
			header: "Fuel",
			location: "right-middle",
			items: [{
					text: "Refill car",
					values: ["5 L", "10 L", "20 L", "40 L", "80 L"],
				},
				{
					text: "Refill canister"
				},
				{
					text: "Back"
				},
			],
		},
		"enter_biz_6": {
			header: "24/7",
			location: "right-middle",
			items: [{
				text: "Shop"
			}, ],
			on: (values) => {
				onEnterBizHandler("enter_biz_6", values);
			},
		},
		"biz_6_items": {
			header: "Shop",
			location: "right-middle",
			items: [{
					text: "eCola"
				},
				{
					text: "EgoChaser"
				},
				{
					text: "Meteorite"
				},
				{
					text: "P's & Q's"
				},
				{
					text: "Redwood package"
				},
				{
					text: "Pisswasser"
				},
				{
					text: "uPhone"
				},
				{
					text: "Bag"
				},
				{
					text: "Canister"
				},
				{
					text: "Plaster"
				},
				{
					text: "Back"
				},
			]
		},
		"enter_biz_7": {
			header: "Tattoo salon",
			location: "right-middle",
			items: [{
					text: "Item 1"
				},
				{
					text: "Item 2"
				},
				{
					text: "Item 3"
				},
			],
			on: (values) => {
				onEnterBizHandler("enter_biz_7", values);
			},
		},
		"enter_biz_8": {
			header: "Gun shop",
			location: "right-middle",
			items: [{
					text: "Weapons"
				},
				{
					text: "Ammo"
				}
			],
			on: (values) => {
				onEnterBizHandler("enter_biz_8", values);
			},
		},
		"biz_8_guns": {
			header: "Weapons",
			location: "right-middle",
			items: [{
					text: "Melee"
				},
				{
					text: "Pistols"
				},
				{
					text: "Submachine guns"
				},
				{
					text: "Shotguns"
				},
				{
					text: "Back"
				},
			]
		},
		"biz_8_melee": {
			header: "Melee",
			location: "right-middle",
			items: [{
					text: "Baseball bat"
				},
				{
					text: "Knuckles"
				},
				{
					text: "Knife"
				},
				{
					text: "Back"
				},
			]
		},
		"biz_8_handguns": {
			header: "Pistols",
			location: "right-middle",
			items: [{
					text: "Pistol"
				},
				{
					text: "AP Pistol"
				},
				{
					text: "Back"
				},
			]
		},
		"biz_8_submachine_guns": {
			header: "Submachine-guns",
			location: "right-middle",
			items: [{
					text: "Micro SMG"
				},
				{
					text: "SMG"
				},
				{
					text: "Back"
				},
			]
		},
		"biz_8_shotguns": {
			header: "Shotguns",
			location: "right-middle",
			items: [{
					text: "Sawed-Off Shotgun"
				},
				{
					text: "Back"
				},
			]
		},
		"biz_8_ammo": {
			header: "Ammo",
			location: "right-middle",
			items: [{
					text: "Ammo - 9mm",
					values: ["10 Pcs.", "20 Pcs.", "40 Pcs.", "80 Pcs."],
				},
				{
					text: "Ammo - 12mm",
					values: ["10 Pcs.", "20 Pcs.", "40 Pcs.", "80 Pcs."],
				},
				{
					text: "Ammo - 5.56mm",
					values: ["10 Pcs.", "20 Pcs.", "40 Pcs.", "80 Pcs."],
				},
				{
					text: "Ammo - 7.62mm",
					values: ["10 Pcs.", "20 Pcs.", "40 Pcs.", "80 Pcs."],
				},
				{
					text: "Back"
				},
			]
		},

		"enter_biz_9": {
			header: "Dealership",
			location: "right-middle",
			items: [{
					text: "Buy a car"
				},
			],
			on: (values) => {
				onEnterBizHandler("enter_biz_9", values);
			},
		},
		"enter_biz_10": {
			header: "LS Customs",
			location: "right-middle",
			items: [{
					text: "Item 1"
				},
				{
					text: "Item 2"
				},
				{
					text: "Item 3"
				},
			],
			on: (values) => {
				onEnterBizHandler("enter_biz_10", values);
			},
		},
		"enter_biz_11": {
			header: "СТО",
			location: "right-middle",
			items: [{
					text: "Item 1"
				},
				{
					text: "Item 2"
				},
				{
					text: "Item 3"
				},
			],
			on: (values) => {
				onEnterBizHandler("enter_biz_11", values);
			},
		},
		"biz_panel": {
			header: "Control Panel",
			location: "right-middle",
			items: [{
					text: "Business information"
				},
				{
					text: "Cashier"
				},
				{
					text: "Income and expenses"
				},
				{
					text: "Product"
				},
				{
					text: "Staff"
				},
				{
					text: "Business improvements"
				},
				{
					text: "Business status"
				},
				{
					text: "Sell the business"
				},
				{
					text: "Back"
				},
			]
		},
		"biz_cashbox": {
			header: "Cashier",
			location: "right-middle",
			items: [{
					text: "Balance of the box office"
				},
				{
					text: "Withdraw from the box office"
				},
				{
					text: "Top up the cash register"
				},
				{
					text: "Back"
				},
			]
		},
		"biz_stats": {
			header: "Income and expenses",
			location: "right-middle",
			items: [{
					text: "The history of the box office"
				},
				{
					text: "Back"
				},
			]
		},
		"biz_products": {
			header: "Business products",
			location: "right-middle",
			items: [{
					text: "Purchase goods"
				},
				{
					text: "Write off the goods"
				},
				{
					text: "The price of goods"
				},
				{
					text: "Back"
				},
			]
		},
		"biz_staff": {
			header: "Business Staffs",
			location: "right-middle",
			items: [{
					text: "Slot No.1"
				},
				{
					text: "Slot No.2"
				},
				{
					text: "Slot No.3"
				},
				{
					text: "Back"
				},
			]
		},
		"biz_rise": {
			header: "Improving your business",
			location: "right-middle",
			items: [{
				text: "Back"
			}, ]
		},
		"biz_status": {
			header: "Business status",
			location: "right-middle",
			items: [{
					text: "Open business"
				},
				{
					text: "Close business"
				},
				{
					text: "Back"
				},
			]
		},
		"biz_sell": {
			header: "Selling a business",
			location: "right-middle",
			items: [{
					text: "Citizen"
				},
				{
					text: "State"
				},
				{
					text: "Back"
				},
			]
		},

		"police_storage": {
			header: "LSPD Warehouse",
			location: "right-middle",
			items: [{
					text: "Service weapons"
				},
				{
					text: "Wardrobe"
				},
				{
					text: "Special items"
				},
				{
					text: "Ammo"
				},
				{
					text: "Close"
				},
			]
		},
		"police_guns": {
			header: "Service weapons LSPD",
			location: "right-middle",
			items: [{
					text: "Nightstick"
				},
				{
					text: "Flashlight"
				},
				{
					text: "Stun Gun"
				},
				{
					text: "Combat Pistol"
				},
				{
					text: "Pump Shotgun"
				},
				{
					text: "Carbine Rifle"
				},
				{
					text: "Back"
				},
			]
		},
		"police_clothes": {
			header: "Wardrobe LSPD",
			location: "right-middle",
			items: [{
					text: "Officer's uniform No.1"
				},
				{
					text: "Uniform SWAT"
				},
				{
					text: "Officer's uniform No.2"
				},
				{
					text: "Body armor"
				},
				{
					text: "Back"
				},
			]
		},
		"police_items": {
			header: "Special items LSPD",
			location: "right-middle",
			items: [{
					text: "PD ID"
				},
				{
					text: "Radio"
				},
				{
					text: "Handcuffs"
				},
				{
					text: "Back"
				},
			]
		},
		"police_ammo": {
			header: "Ammo LSPD",
			location: "right-middle",
			items: [{
					text: "Combat Pistol - 9mm",
					values: ["12 Pcs.", "24 Pcs.", "32 Pcs."],
				},
				{
					text: "Pump Shotgun - 12mm",
					values: ["8 Pcs.", "16 Pcs.", "24 Pcs."],
				},
				{
					text: "Carbine Rifle - 5.56mm",
					values: ["12 Pcs.", "24 Pcs.", "32 Pcs."],
				},
				{
					text: "Sniper Rifle - 7.62mm",
					values: ["10 Pcs.", "20 Pcs.", "30 Pcs."],
				},
				{
					text: "Back"
				},
			]
		},
		"police_service": {
			header: "LSPD services",
			location: "right-middle",
			items: [{
					text: "Restoring items",
				},
				{
					text: "Payment of Pcsraf",
				},
				{
					text: "Close",
				},
			],
			on: (values) => {
				if (!values) return delete menus["police_service_recovery"].items[2].values;
				for (var i = 0; i < values.length; i++)
					values[i] = `No.${values[i]}`;
				menus["police_service_recovery"].items[2].values = values;
			}
		},
		"police_service_recovery": {
			header: "Restoring items",
			location: "right-middle",
			items: [{
					text: "Documents",
				},
				{
					text: "Car keys",
				},
				{
					text: "Keys to the house",
				},
				{
					text: "Back",
				},
			]
		},

		"police_storage_2": {
			header: "Warehouse LSSD",
			location: "right-middle",
			items: [{
					text: "Service weapons"
				},
				{
					text: "Wardrobe"
				},
				{
					text: "Special items"
				},
				{
					text: "Ammo"
				},
				{
					text: "Close"
				},
			]
		},
		"police_guns_2": {
			header: "Service weapons LSSD",
			location: "right-middle",
			items: [{
					text: "Nightstick"
				},
				{
					text: "Flashlight"
				},
				{
					text: "Stun Gun"
				},
				{
					text: "Combat Pistol"
				},
				{
					text: "Pump Shotgun"
				},
				{
					text: "Carbine Rifle"
				},
				{
					text: "Back"
				},
			]
		},
		"police_clothes_2": {
			header: "Wardrobe LSSD",
			location: "right-middle",
			items: [{
					text: "Special uniform No.1"
				},
				{
					text: "Uniform Cadet"
				},
				{
					text: "Uniform Sheriff's Deputy"
				},
				{
					text: "Uniform Sergeant"
				},
				{
					text: "Uniform Lieutenant"
				},
				{
					text: "Uniform Captain"
				},
				{
					text: "Uniform Sheriff"
				},
				{
					text: "Body armor"
				},
				{
					text: "Back"
				},
			]
		},
		"police_items_2": {
			header: "Special items LSSD",
			location: "right-middle",
			items: [{
					text: "PD ID"
				},
				{
					text: "Radio"
				},
				{
					text: "Handcuffs"
				},
				{
					text: "Back"
				},
			]
		},
		"police_ammo_2": {
			header: "Ammo LSSD",
			location: "right-middle",
			items: [{
					text: "Combat Pistol - 9mm",
					values: ["12 Pcs.", "24 Pcs.", "32 Pcs."],
				},
				{
					text: "Pump Shotgun - 12mm",
					values: ["8 Pcs.", "16 Pcs.", "24 Pcs."],
				},
				{
					text: "Carbine Rifle - 5.56mm",
					values: ["12 Pcs.", "24 Pcs.", "32 Pcs."],
				},
				{
					text: "Sniper Rifle - 7.62mm",
					values: ["10 Pcs.", "20 Pcs.", "30 Pcs."],
				},
				{
					text: "Back"
				},
			]
		},
		"police_service_2": {
			header: "Services LSSD",
			location: "right-middle",
			items: [{
					text: "Restoring items",
				},
				{
					text: "Payment of Pcsraf",
				},
				{
					text: "Close",
				},
			],
			on: (values) => {
				if (!values) return delete menus["police_service_recovery_2"].items[2].values;
				for (var i = 0; i < values.length; i++)
					values[i] = `No.${values[i]}`;
				menus["police_service_recovery_2"].items[2].values = values;
			}
		},
		"police_service_recovery_2": {
			header: "Restoring items",
			location: "right-middle",
			items: [{
					text: "Documents",
				},
				{
					text: "Car keys",
				},
				{
					text: "Keys to the house",
				},
				{
					text: "Back",
				},
			]
		},

		"army_storage": {
			header: "Warehouse Fort Zancudo",
			location: "right-middle",
			items: [{
					text: "Service weapons"
				},
				{
					text: "Wardrobe"
				},
				{
					text: "Special items"
				},
				{
					text: "Ammo"
				},
				{
					text: "Close"
				},
			]
		},
		"army_guns": {
			header: "Service weapons Fort Zancudo",
			location: "right-middle",
			items: [{
					text: "Combat Pistol"
				},
				{
					text: "Pump Shotgun"
				},
				{
					text: "Carbine Rifle"
				},
				{
					text: "Back"
				},
			]
		},
		"army_clothes": {
			header: "Wardrobe Fort Zancudo",
			location: "right-middle",
			items: [{
					text: "Uniform Recruit"
				},
				{
					text: "Tactical set No.1"
				},
				{
					text: "Department IB"
				},
				{
					text: "Department FZA"
				},
				{
					text: "Combat uniform TFB"
				},
				{
					text: "Department MLG"
				},
				{
					text: "Army uniform No.1"
				},
				{
					text: "Army uniform No.2"
				},
				{
					text: "Body armor"
				},
				{
					text: "Back"
				},
			]
		},
		"army_items": {
			header: "Special items Fort Zancudo",
			location: "right-middle",
			items: [{
					text: "Identity Army"
				},
				{
					text: "Radio"
				},
				{
					text: "Back"
				},
			]
		},
		"army_ammo": {
			header: "Ammo Fort Zancudo",
			location: "right-middle",
			items: [{
					text: "Combat Pistol - 9mm",
					values: ["12 Pcs.", "24 Pcs.", "32 Pcs."],
				},
				{
					text: "Pump Shotgun - 12mm",
					values: ["8 Pcs.", "16 Pcs.", "24 Pcs."],
				},
				{
					text: "Carbine Rifle - 5.56mm",
					values: ["12 Pcs.", "24 Pcs.", "32 Pcs."],
				},
				{
					text: "Sniper Rifle - 7.62mm",
					values: ["10 Pcs.", "20 Pcs.", "30 Pcs."],
				},
				{
					text: "Back"
				},
			]
		},

		"army_storage_2": {
			header: "Warehouse USN",
			location: "right-middle",
			items: [{
					text: "Service weapons"
				},
				{
					text: "Wardrobe"
				},
				{
					text: "Special items"
				},
				{
					text: "Ammo"
				},
				{
					text: "Close"
				},
			]
		},
		"army_guns_2": {
			header: "Service weapons USN",
			location: "right-middle",
			items: [{
					text: "Combat Pistol"
				},
				{
					text: "Pump Shotgun"
				},
				{
					text: "Carbine Rifle"
				},
				{
					text: "Back"
				},
			]
		},
		"army_clothes_2": {
			header: "Wardrobe USN",
			location: "right-middle",
			items: [{
					text: "Squad - GRS"
				},
				{
					text: "Squad - TLS"
				},
				{
					text: "Squad - FHS"
				},
				{
					text: "Army uniform"
				},
				{
					text: "Special uniform"
				},
				{
					text: "Body armor"
				},
				{
					text: "Back"
				},
			]
		},
		"army_items_2": {
			header: "Special items USN",
			location: "right-middle",
			items: [{
					text: "Identity Army"
				},
				{
					text: "Radio"
				},
				{
					text: "Back"
				},
			]
		},
		"army_ammo_2": {
			header: "Ammo USN",
			location: "right-middle",
			items: [{
					text: "Combat Pistol - 9mm",
					values: ["12 Pcs.", "24 Pcs.", "32 Pcs."],
				},
				{
					text: "Pump Shotgun - 12mm",
					values: ["8 Pcs.", "16 Pcs.", "24 Pcs."],
				},
				{
					text: "Carbine Rifle - 5.56mm",
					values: ["12 Pcs.", "24 Pcs.", "32 Pcs."],
				},
				{
					text: "Sniper Rifle - 7.62mm",
					values: ["10 Pcs.", "20 Pcs.", "30 Pcs."],
				},
				{
					text: "Back"
				},
			]
		},

		"fib_storage": {
			header: "Warehouse FIB",
			location: "right-middle",
			items: [{
					text: "Service weapons"
				},
				{
					text: "Wardrobe"
				},
				{
					text: "Special items"
				},
				{
					text: "Ammo"
				},
				{
					text: "Close"
				},
			]
		},
		"fib_guns": {
			header: "Service weapons FIB",
			location: "right-middle",
			items: [{
					text: "Nightstick"
				},
				{
					text: "Flashlight"
				},
				{
					text: "Stun Gun"
				},
				{
					text: "Combat Pistol"
				},
				{
					text: "Pump Shotgun"
				},
				{
					text: "Carbine Rifle"
				},
				{
					text: "Back"
				},
			]
		},
		"fib_clothes": {
			header: "Wardrobe FIB",
			location: "right-middle",
			items: [{
					text: "Intern"
				},
				{
					text: "Agent"
				},
				{
					text: "Tactical set No.1"
				},
				{
					text: "Tactical set No.2"
				},
				{
					text: "Uniform Sniper"
				},
				{
					text: "Body armor"
				},
				{
					text: "Back"
				},
			]
		},
		"fib_items": {
			header: "Special items FIB",
			location: "right-middle",
			items: [{
					text: "Identity FIB"
				},
				{
					text: "Radio"
				},
				{
					text: "Handcuffs"
				},
				{
					text: "Back"
				},
			]
		},
		"fib_ammo": {
			header: "Ammo FIB",
			location: "right-middle",
			items: [{
					text: "Combat Pistol - 9mm",
					values: ["12 Pcs.", "24 Pcs.", "32 Pcs."],
				},
				{
					text: "Pump Shotgun - 12mm",
					values: ["8 Pcs.", "16 Pcs.", "24 Pcs."],
				},
				{
					text: "Carbine Rifle - 5.56mm",
					values: ["12 Pcs.", "24 Pcs.", "32 Pcs."],
				},
				{
					text: "Sniper Rifle - 7.62mm",
					values: ["10 Pcs.", "20 Pcs.", "30 Pcs."],
				},
				{
					text: "Back"
				},
			]
		},

		"band_storage": {
			header: "Warehouse Gang",
			location: "right-middle",
			items: [{
					text: "Special items"
				},
				{
					text: "Close"
				},
			]
		},
		"band_dealer_menu": {
			header: "Dealer",
			location: "right-middle",
			items: [{
					text: "Weapons"
				},
				{
					text: "Ammo"
				},
				{
					text: "Drugs"
				},
				{
					text: "Close"
				},
			]
		},
		"band_dealer_menu_guns": {
			header: "Weapons",
			location: "right-middle",
			items: [{
					text: "Cold weapons"
				},
				{
					text: "Pistols"
				},
				{
					text: "Pistols-пулеметы"
				},
				{
					text: "Shotguns"
				},
				{
					text: "Assault rifles"
				},
				{
					text: "Back"
				},
			]
		},
		"band_dealer_menu_melee": {
			header: "Cold weapons",
			location: "right-middle",
			items: [{
					text: "Baseball bat | $200"
				},
				{
					text: "Knuckles | $75"
				},
				{
					text: "Knife | $300"
				},
				{
					text: "Back"
				},
			]
		},
		"band_dealer_menu_handguns": {
			header: "Pistols",
			location: "right-middle",
			items: [{
					text: "Pistol | $800"
				},
				{
					text: "AP Pistol | $1200"
				},
				{
					text: "Heavy Revolver | $1400"
				},
				{
					text: "Back"
				},
			]
		},
		"band_dealer_menu_submachine_guns": {
			header: "Pistols-пулеметы",
			location: "right-middle",
			items: [{
					text: "Micro SMG | $1800"
				},
				{
					text: "SMG | $1950"
				},
				{
					text: "Back"
				},
			]
		},
		"band_dealer_menu_shotguns": {
			header: "Shotguns",
			location: "right-middle",
			items: [{
					text: "Pump Shotgun | $2400"
				},
				{
					text: "Sawed-Off Shotgun | $2700"
				},
				{
					text: "Back"
				},
			]
		},
		"band_dealer_menu_assault_rifles": {
			header: "Assault rifles",
			location: "right-middle",
			items: [{
					text: "Assault Rifle | $2800"
				},
				{
					text: "Bullpup Rifle | $3000"
				},
				{
					text: "Compact Rifle | $3000"
				},
				{
					text: "Back"
				},
			]
		},
		"band_dealer_menu_ammo": {
			header: "Ammo",
			location: "right-middle",
			items: [{
					text: "Ammo - 9mm | $6",
					values: ["10 Pcs.", "20 Pcs.", "40 Pcs.", "80 Pcs."],
				},
				{
					text: "Ammo - 12mm | $7",
					values: ["10 Pcs.", "20 Pcs.", "40 Pcs.", "80 Pcs."],
				},
				{
					text: "Ammo - 5.56mm | $7",
					values: ["10 Pcs.", "20 Pcs.", "40 Pcs.", "80 Pcs."],
				},
				{
					text: "Ammo - 7.62mm | $6",
					values: ["10 Pcs.", "20 Pcs.", "40 Pcs.", "80 Pcs."],
				},
				{
					text: "Back"
				},
			]
		},
		"band_dealer_menu_drugs": {
			header: "Drugs",
			location: "right-middle",
			items: [{
					text: "Marijuana | $6",
					values: ["1 г.", "5 г.", "20 г.", "40 г."],
				},
				{
					text: "MDMA | $10",
					values: ["1 г.", "5 г.", "20 г.", "40 г."],
				},
				{
					text: "Cocaine | $8",
					values: ["1 г.", "5 г.", "20 г.", "40 г."],
				},
				{
					text: "Methamphetamine | $9",
					values: ["1 г.", "5 г.", "20 г.", "40 г."],
				},
				{
					text: "Back"
				},
			]
		},
		"hospital_storage": {
			header: "Warehouse Hospital",
			location: "right-middle",
			items: [{
					text: "Service accessories"
				},
				{
					text: "Wardrobe"
				},
				{
					text: "Close"
				},
			]
		},
		"hospital_items": {
		    header: "Service accessories Hospital",
		    location: "right-middle",
		    items: [{
		            text: "Аптечка",
		            values: ["1 Pcs.", "2 Pcs.", "3 Pcs."]
		        },
		        {
		            text: "Plaster",
		            values: ["1 Pcs.", "2 Pcs.", "3 Pcs."]
		        },
		        {
		            text: "Identity Hospital"
		        },
		        {
		            text: "Back"
		        },
		    ]
		},
		"hospital_clothes": {
		    header: "Wardrobe Hospital",
		    location: "right-middle",
		    items: [{
		            text: "Uniform парамquantityика No.1"
		        },
		        {
		            text: "Uniform парамquantityика No.2"
		        },
		        {
		            text: "Back"
		        },
		    ]
		},
		"rooberauto_menu": {
			header: "Simon",
			location: "right-middle",
			items: [{
					text: "Driving"
				},
				{
					text: "Car theft"
				},
				{
					text: "Close"
				},
			]
		},
		"bank_menu": {
			header: "Bank",
			location: "right-middle",
			items: []
		},
		"rent_faggio": {
			header: "Rent",
			location: "right-middle",
			items: []
		},
		"helper_main": {
			header: "Help",
			location: "right-middle",
			items: []
		},
		"helper_second": {
			header: "Help",
			location: "right-middle",
			items: []
		},
		"ls_customs_repair": {
			logo: true,
			header: "LS Customs",
			location: "left-top",
			items: [{
					text: "Repairs"
				},
				{
					text: "Exit"
				}
			]
		},
		"ls_customs_main": {
			logo: true,
			header: "LS Customs",
			location: "left-top",
			items: []
		},
		"ls_customs_concreteMod": {
			logo: true,
			header: "",
			location: "left-top",
			items: []
		},
		"ls_customs_headlightsMenu": {
			logo: true,
			header: "Headlights",
			location: "left-top",
			items: []
		},
		"ls_customs_headlights": {
			logo: true,
			header: "Headlights",
			location: "left-top",
			items: [{
					text: "Standard headlights"
				},
				{
					text: "Xenon headlights"
				}
			]
		},
		"ls_customs_neonMenu": {
			logo: true,
			header: "Neon sets",
			location: "left-top",
			items: [{
					text: "Neon tube arrangement"
				},
				{
					text: "Neon color"
				}
			]
		},
		"ls_customs_neonPosition": {
			logo: true,
			header: "Neon tube arrangement",
			location: "left-top",
			items: [{
					text: "Not"
				},
				{
					text: "Front"
				},
				{
					text: "Back"
				},
				{
					text: "On the sides"
				},
				{
					text: "Front and back"
				},
				{
					text: "Front and sides"
				},
				{
					text: "Back and sides"
				},
				{
					text: "Front, back and sides"
				}
			]
		},
		"ls_customs_neonColor": {
			logo: true,
			header: "Neon color",
			location: "left-top",
			items: [/* {
					text: "Белый"
				},
				{
					text: "Синий"
				},
				{
					text: '"Электрический голубой"'
				},
				{
					text: '"Мятно-зеленый"'
				},
				{
					text: "Лайм"
				},
				{
					text: "Желтый"
				},
				{
					text: '"Золотой дождь"'
				},
				{
					text: "Оранжевый"
				},
				{
					text: "Красный"
				},
				{
					text: '"Розовый пони"'
				},
				{
					text: "Ярко-розовый"
				},
				{
					text: "Фиолетовый"
				},
				{
					text: '"Черный свет"'
				} */
			]
		},
		"ls_customs_hornsMenu": {
			logo: true,
			header: "Horns",
			location: "left-top",
			items: [{
					text: "Standard"
				},
				{
					text: "Musical"
				},
				{
					text: "Replay"
				}
			]
		},
		"ls_customs_hornsConcrete": {
			logo: true,
			header: "Horns",
			location: "left-top",
			items: []
		},
		"ls_customs_numberPlate": {
			logo: true,
			header: "Number plates",
			location: "left-top",
			items: [{
					text: "Blue on white 1"
				},
				{
					text: "Blue on white 2"
				},
				{
					text: "Blue on white 3"
				},
				{
					text: "Yellow on blue"
				},
				{
					text: "Yellow on black"
				}
			]
		},
		"ls_customs_colorMenu": {
			logo: true,
			header: "Coloring",
			location: "left-top",
			items: [{
					text: "Main colour"
				},
				{
					text: "Extra colour"
				}
			]
		},
		"ls_customs_colorGroup": {
			logo: true,
			header: "Color groups",
			location: "left-top",
			items: [{
					text: "Chrome plated"
				},
				{
					text: "Classic"
				},
				{
					text: "Matte"
				},
				{
					text: "Metallic"
				},
				{
					text: "Metal"
				}
			]
		},
		"ls_customs_colorConcrete": {
			logo: true,
			header: "Color groups",
			location: "left-top",
			items: []
		},
		"ls_customs_wheelsMenu": {
			logo: true,
			header: "Wheels",
			location: "left-top",
			items: [
						{ text: "Wheels" },
						{ text: "Color wheels" },
						{ text: "Tires" },
					]
			},
		"ls_customs_wheels_motoMenu": {
			logo: true,
			header: "Wheels",
			location: "left-top",
			items: [
							{ text: "Front wheel" },
							{ text: "Rear wheel" }
						]
				},
		"ls_customs_wheels_carMenu": {
			logo: true,
			header: "Wheel types",
			location: "left-top",
			items: [
							{ text: "Exclusive" },
							{ text: "Lowrider" },
							{ text: "Muscle" },
							{ text: "Vault" },
							{ text: "Sport" },
							{ text: "SUV" },
							{ text: "Tuner" }
						]
		},
		"ls_customs_wheels_typeMenu": {
			logo: true,
			header: "Disk types",
			location: "left-top",
			items: [
							{ text: "Standard wheels" },
							{ text: "Chrome wheels" }
						]
		},
		"ls_customs_wheels_colors": {
			logo: true,
			header: "Wheel colors",
			location: "left-top",
			items: []
		},
		"ls_customs_wheels_concreteMenu": {
			logo: true,
			header: "Wheels",
			location: "left-top",
			items: []
		},
		"ls_customs_wheels_tiresMenu": {
			logo: true,
			header: "Tires",
			location: "left-top",
			items: [
				{ text: "Tire Design" },
				{ text: "Tire Improvements" },
				{ text: "Tire Smoke" }
			]
		},
		"ls_customs_wheels_tiresDesign": {
			logo: true,
			header: "Tire Design",
			location: "left-top",
			items: [
				/* { text: "Обычные покрышки" },
				{ text: "Заказные покрышки" } */
			]
		},
		"ls_customs_wheels_tiresUpgrade": {
			logo: true,
			header: "Tire Improvements",
			location: "left-top",
			items: [
				/* { text: "Пулестойкие покрышки" } */
			]
		},
		"ls_customs_wheels_tiresSmokeColor": {
			logo: true,
			header: "Tire Smoke",
			location: "left-top",
			items: []
		},
		"ls_customs_turbo": {
			logo: true,
			header: "Turbochargers",
			location: "left-top",
			items: [
				/* { text: "Not" },
				{ text: "Турбо-тюнинг" } */
			]
		},
		"ls_customs_windows": {
			logo: true,
			header: "Tinted",
			location: "left-top",
			items: [
				/* { text: "Not" },
				{ text: "Слабое затемнение" },
				{ text: "Срquantityнее затемнение" },
				{ text: "Лимузин" } */
			]
		},
		"enter_driving_school": {
			header: "Licensing Center",
			location: "right-middle",
			items: [{
					text: "Licenses"
				},
				{
					text: "Close"
				},
			]
		},
		"driving_school_licenses": {
			header: "Licenses",
			location: "right-middle",
			items: [{
					text: "Driver"
				},
				{
					text: "Water transport"
				},
				{
					text: "Pilot"
				},
				{
					text: "Back"
				},
			]
		},
		"driving_school_car": {
			header: "Driver",
			location: "right-middle",
			items: [{
					text: "Car License"
				},
				{
					text: "Moto License"
				},
				{
					text: "Back"
				},
			]
		},
		"driving_school_water": {
			header: "Water transport",
			location: "right-middle",
			items: [{
					text: "Boat License"
				},
				{
					text: "Yacht License"
				},
				{
					text: "Back"
				},
			]
		},
		"driving_school_fly": {
			header: "Pilot",
			location: "right-middle",
			items: [{
					text: "Helicopter License"
				},
				{
					text: "Aircraft License"
				},
				{
					text: "Back"
				},
			]
		},
		"trucker_load": {
			header: "Trailer loading",
			location: "right-middle",
			items: [{
					text: "Load",
					values: [] // filling in on()
				},
				{
					text: "Close"
				},
			],
			on: () => {
				menus["trucker_load"].items[0].values = [];
				for (var i = 0; i < 50; i++) menus["trucker_load"].items[0].values.push(`${i + 1} т.`);
			},
		},
		"barbershop_m_main": {
			logo: true,
			header: "CATEGORIES",
			location: "left-top",
			items: [
				{ text: "Haircuts" },
				{ text: "Beards" },
				{ text: "Eyebrows" },
				{ text: "Chest" },
				{ text: "Lenses" },
				{ text: "Face painting" },
				{ text: "Makeup" },
				{ text: "Back" }
			]
		},
		"barbershop_f_main": {
			logo: true,
			header: "CATEGORIES",
			location: "left-top",
			items: [
				{ text: "Haircuts" },
				{ text: "Eyebrows" },
				{ text: "Lenses" },
				{ text: "Face painting" },
				{ text: "Makeup" },
				{ text: "Back" }
			]
		},
		"barbershop_concrete": {
			logo: true,
			header: "",
			location: "left-top",
			items: []
		},
		"barbershop_makeupMenu_m": {
			logo: true,
			header: "Makeup",
			location: "left-top",
			items: [
				{ text: "Eye" },
				{ text: "Lips" }
			]
		},
		"barbershop_makeupMenu_f": {
			logo: true,
			header: "Makeup",
			location: "left-top",
			items: [
				{ text: "Blush" },
				{ text: "Eye" },
				{ text: "Lips" }
			]
		},

		"enter_farm": {
			header: "Farm",
			location: "right-middle",
			items: [
				{
					text: "Job"
				},
				{
					text: "Info"
				},
				{
					text: "Help"
				},
				{
					text: "Close"
				},
			]
		},
		"enter_farm_job": {
			header: "Farm job",
			location: "right-middle",
			items: [
				{
					text: "Work"
				},
				{
					text: "Farmer"
				},
				{
					text: "Tractor driver"
				},
				{
					text: "Pilot"
				},
				{
					text: "Quit"
				},
				{
					text: "Back"
				},
			]
		},
		"farm_warehouse": {
			header: "Warehouse farms",
			location: "right-middle",
			items: [
				{
					text: "Grain crops",
				},
				{
					text: "Purchase of a harvest",
				},
				{
					text: "Grain sale",
				},
				{
					text: "Unloading of a harvest",
				},
				{
					text: "Close"
				},
			]
		},
		"farm_warehouse_fill_field": {
			header: "Grain loading",
			location: "right-middle",
			items: [
				{
					text: "field",
					values: ["Site No.1", "Site No.2", "Site No.3", "Site No.4"],
				},
				{
					text: "Grain",
					values: ["Pumpkin", "Cabbage", "Grass"],
				},
				{
					text: "Load",
				},
				{
					text: "Back"
				},
			]
		},
		"farm_warehouse_buy_crop": {
			header: "Purchase of a harvest",
			location: "right-middle",
			items: [
				{
					text: "Harvest",
					values: ["Pumpkin", "Cabbage", "Grass"],
				},
				{
					text: "Quantity",
					values: ["1 quantity.", "2 quantity.", "3 quantity."],
				},
				{
					text: "Закупить",
				},
				{
					text: "Back"
				},
			]
		},
		"farm_warehouse_sell_grain": {
			header: "Grain sale",
			location: "right-middle",
			items: [
				{
					text: "Quantity",
					values: ["1 quantity.", "2 quantity.", "3 quantity."],
				},
				{
					text: "Sell",
				},
				{
					text: "Back"
				},
			]
		},
	};
	var itemSelectedHandlers = {
		"farm_warehouse_fill_field": (itemName, itemValue, itemIndex) => {
			var fieldIdValueIndex = menus["farm_warehouse_fill_field"].items[0].valueIndex;
			if (!fieldIdValueIndex) fieldIdValueIndex = 0;
			var fieldId = parseInt(menus["farm_warehouse_fill_field"].items[0].values[fieldIdValueIndex].split(" ")[1].substr(1));

			var grainTypeValueIndex = menus["farm_warehouse_fill_field"].items[1].valueIndex;
			if (!grainTypeValueIndex) grainTypeValueIndex = 0;

			mp.trigger(`events.callRemote`, `farm.warehouse.takeGrain`, JSON.stringify([fieldId, grainTypeValueIndex + 1]));
			selectMenuAPI.hide();
		},
	};

	window.selectMenuAPI = {
		show: (menuName, selectedIndex = 0, values = null) => {
			// alert(`selectMenu.show ${menuName} ${selectedIndex} ${values}`);
			if (!selectedIndex) selectedIndex = 0;
			var menu = menus[menuName];
			if (!menu) return;

			menu.name = menuName;
			window.currentMenu = menu;
			if (values != null && values != 'null') menu.on(JSON.parse(values));
			else if (menu.on) menu.on();

			var maxItemsCount = MAX_ITEMS_COUNT;
			if (menu.maxItemsCount) maxItemsCount = menu.maxItemsCount;

			var itemsCount = Math.min(menu.items.length, maxItemsCount);
			var height = itemsCount * ITEM_HEIGHT + "vh";
			$(".selectMenu .body").height(height);
			$(".selectMenu .name").text(menu.header);
			$(".selectMenu .count").text(`1/${menu.items.length}`);
			$(".selectMenu .items").empty();

			var start = (selectedIndex < maxItemsCount) ? 0 : (selectedIndex - maxItemsCount + 1);
			for (var i = start; i < start + itemsCount; i++) {
				selectMenuAPI.addLastMenuItemToDOM(i);
			}

			if (menu.items[selectedIndex].values) {
				var value = $('.selectMenu .items td').eq(1).html();
				$('.selectMenu .items td').eq(1).html(`<b>< </b>${value}<b> ></b>`);
			}
			$(`.selectMenu .items tr[data-index="${selectedIndex}"]`).addClass("selected");
			if (menu.items[selectedIndex].type == "text-field") {
				setTimeout(() => {
					$('.selectMenu .selected input').focus();
				}, 5);
			}

			if (menu.location == "right-middle" && !chatAPI.isLeft())
				menu.location = "left-middle";
			else if (menu.location == "left-middle" && chatAPI.isLeft())
				menu.location = "right-middle";

			switch (menu.location) {
				case 'left-top':
					$('.selectMenu').css('left', '1vh');
					$('.selectMenu').css('top', '1vh');
					$('.selectMenu').css('right', '');
					$('.selectMenu').css('bottom', '');
					break;
				case 'left-middle':
					$('.selectMenu').css('left', '10vh');
					$('.selectMenu').css('top', '25vh');
					$('.selectMenu').css('right', '');
					$('.selectMenu').css('bottom', '');
					break;
				case 'left-middle-upper':
					$('.selectMenu').css('left', '10vh');
					$('.selectMenu').css('top', '12.5vh');
					$('.selectMenu').css('right', '');
					$('.selectMenu').css('bottom', '');
					break;
				case 'right-top':
					$('.selectMenu').css('left', '');
					$('.selectMenu').css('top', '1vh');
					$('.selectMenu').css('right', '1vh');
					$('.selectMenu').css('bottom', '');
					break;
				case 'right-middle':
					$('.selectMenu').css('left', '');
					$('.selectMenu').css('top', '25vh');
					$('.selectMenu').css('right', '10vh');
					$('.selectMenu').css('bottom', '');
					break;
				case 'right-middle-upper':
					$('.selectMenu').css('left', '');
					$('.selectMenu').css('top', '12.5vh');
					$('.selectMenu').css('right', '10vh');
					$('.selectMenu').css('bottom', '');
					break;
				case 'top':
					$('.selectMenu').css('left', Math.max(0, (($(window).width() - $('.selectMenu').outerWidth()) / 2) + $(window).scrollLeft()) + 'px');
					$('.selectMenu').css('top', '10vh');
					$('.selectMenu').css('right', '');
					$('.selectMenu').css('bottom', '');
					break;
			}

			$(`.selectMenu .promptHelp`).hide()
			if (menu.prompt) {
				$(`.selectMenu .promptHelp .text`).text(menu.prompt);
				$(`.selectMenu .promptHelp`).slideDown("fast");
			}

			$(`.selectMenu .hand-navigation`).hide();
			if (menu.items.length > maxItemsCount) {
				$(`.selectMenu .hand-navigation`).slideDown("fast");
			}

			$(`.selectMenu .union-img`).hide();
			if (menu.logo) $(`.selectMenu .union-img`).show();

			if (menuName != "character_parents") $(`.selectMenu .family-preview`).hide();

			$(".selectMenu").slideDown("fast");
			mp.trigger(`setSelectMenuActive`, true);
		},
		hide: () => {
			window.currentMenu = null;
			$(".selectMenu").slideUp("fast");
			mp.trigger(`setSelectMenuActive`, false);
		},
		addLastMenuItemToDOM: (i) => {
			if (!currentMenu) return;
			var menu = currentMenu;
			var menuName = currentMenu.name;
			var value = "";
			var defaultIndex = menu.items[i].valueIndex || 0;

			if (menu.items[i].type == "choice-color") {

				value = menu.items[i].values[defaultIndex];
				var el = $(`<tr data-index='${i}'>
							  <td>${menu.items[i].text}</td>
							  <td align="right" class="color-td"><div></div></td>
						</tr>`);
				el.children('.color-td').children('div').css('background', value);

				$(".selectMenu .items").append(el);
			} else if (menu.items[i].type == "text-field") {
				value = menu.items[i].value || "";
				var placeholder = menu.items[i].placeholder || "";
				$(".selectMenu .items").append(`<tr data-index='${i}'>
							  <td>${menu.items[i].text}</td>
							  <td align="right"><input type='text' placeholder='${placeholder}' value='${value}' /></td>
						</tr>`);
			} else {
				if (menu.items[i].values) value = menu.items[i].values[defaultIndex];

				$(".selectMenu .items").append(`<tr data-index='${i}'>
							  <td>${menu.items[i].text}</td>
							  <td align="right">${value}</td>
						</tr>`);
			}
		},
		addFirstMenuItemToDOM: (i) => {
			if (!currentMenu) return;
			var menu = currentMenu;
			var menuName = currentMenu.name;
			var value = "";
			var defaultIndex = menu.items[i].valueIndex || 0;

			if (menu.items[i].type == "choice-color") {


				value = menu.items[i].values[defaultIndex];
				var el = $(`<tr data-index='${i}'>
							  <td>${menu.items[i].text}</td>
							  <td align="right" class="color-td"><div></div></td>
						</tr>`);
				el.children('.color-td').children('div').css('background', value);

				$(".selectMenu .items").prepend(el);
			} else if (menu.items[i].type == "text-field") {
				value = menu.items[i].value;
				var placeholder = menu.items[i].placeholder || "";
				$(".selectMenu .items").prepend(`<tr data-index='${i}'>
							  <td>${menu.items[i].text}</td>
							  <td align="right"><input type='text' placeholder='${placeholder}' value='${value}' /></td>
						</tr>`);
			} else {
				if (menu.items[i].values) value = menu.items[i].values[defaultIndex];

				$(".selectMenu .items").prepend(`<tr data-index='${i}'>
							  <td>${menu.items[i].text}</td>
							  <td align="right">${value}</td>
						</tr>`);
			}
		},
		active: () => {
			return $(".selectMenu").css("display") != "none";
		},
		init: () => {
			$(document).unbind('keydown', selectMenuAPI.handler);
			$(document).keydown(selectMenuAPI.handler);
		},
		clearState: (menuName) => {
			var items = menus[menuName].items;
			if (!items) return;
			for (var i = 0; i < items.length; i++) {
				items[i].valueIndex = 0;
			}
		},
		setItems: (menuName, itemsName) => {
			var menu = menus[menuName];
			var items = menuItems[itemsName];
			if (!menu || !items) return;

			menu.items = items;
		},
		setSpecialItems: (menuName, items) => {
			//debug(`selectMenuAPI.setSpecialItems: ${menuName} ${items}`)
			items = JSON.parse(items);
			var menu = menus[menuName];
			if (!menu || !items) return;
			menu.items = items;
		},
		setItemName: (menuName, index, newName) => {
			var menu = menus[menuName];
			if (!menu.items[index]) return;
			menu.items[index] = newName;
		},
		setHeader: (menuName, header) => {
			const menu = menus[menuName];

			if (!menu) {
				return;
			}

			menu.header = header;
		},
		setPrompt: (menuName, text) => {
			const menu = menus[menuName];

			if (!menu) {
				return;
			}

			menu.prompt = text;
		},
		setItemValueIndex: (menuName, itemIndex, index) => {
			const menu = menus[menuName];

			if (!menu) {
				return;
			}

			if (!menu.items[itemIndex]) {
				return;
			}

			menu.items[itemIndex].valueIndex = index;
		},
		handler: (e) => {
			if (!selectMenuAPI.active() || !currentMenu || window.telephone.active() || window.playerMenu.active() || window.medicTablet.active() || window.sheriffTablet.active() || window.pdTablet.active() || window.armyTablet.active() || window.fibTablet.active() || chatAPI.active() || consoleAPI.active()) return;
			if (e.keyCode == 38) { //up

				var items = currentMenu.items;
				var itemIndex = $(".selectMenu .selected").data("index");
				if (itemIndex < 1) return;

				if ($(".selectMenu .selected").is(":first-child")) {
					$(".selectMenu .items tr:last").remove();
					selectMenuAPI.addFirstMenuItemToDOM(itemIndex - 1);
				}

				if (items[itemIndex].type == "text-field") {
					items[itemIndex].value = $(".selectMenu .selected input").val();
					$(".selectMenu .selected input").blur();
				}

				$(".selectMenu .count").text(`${itemIndex}/${items.length}`);
				if (items[itemIndex].values) $('.selectMenu .selected b').remove();

				$(".selectMenu .items .selected").removeClass("selected");
				$(`tr[data-index="${itemIndex-1}"]`).attr("class", "selected");

				var itemValue = null;
				if (items[itemIndex - 1].values) {
					var value = $('.selectMenu .selected td').eq(1).html();
					var valueIndex = items[itemIndex - 1].valueIndex || 0;
					itemValue = items[itemIndex - 1].values[valueIndex];
					$('.selectMenu .selected td').eq(1).html(`<b>< </b>${value}<b> ></b>`);
				}
				if (items[itemIndex - 1].type == "text-field") {
					setTimeout(() => {
						$(".selectMenu .selected input").focus();
					}, 5);
				}

				mp.trigger(`selectMenu.itemFocusChanged`, currentMenu.name, items[itemIndex - 1].text, itemValue, itemIndex - 1, valueIndex);
			} else if (e.keyCode == 40) { //bottom
				var items = currentMenu.items;
				var itemIndex = $(".selectMenu .selected").data("index");
				if (itemIndex >= items.length - 1) return;

				if ($(".selectMenu .selected").is(":last-child")) {
					$(".selectMenu .items tr:first").remove();
					selectMenuAPI.addLastMenuItemToDOM(itemIndex + 1);
				}

				if (items[itemIndex].type == "text-field") {
					items[itemIndex].value = $(".selectMenu .selected input").val();
					$(".selectMenu .selected input").blur();
				}

				$(".selectMenu .count").text(`${itemIndex+2}/${items.length}`);
				if (items[itemIndex].values) $('.selectMenu .selected b').remove();


				$(".selectMenu .items .selected").removeClass("selected");
				$(`tr[data-index="${itemIndex+1}"]`).attr("class", "selected");

				var itemValue = null;
				if (items[itemIndex + 1].values) {
					var value = $('.selectMenu .selected td').eq(1).html();
					var valueIndex = items[itemIndex + 1].valueIndex || 0;
					itemValue = items[itemIndex + 1].values[valueIndex];
					$('.selectMenu .selected td').eq(1).html(`<b>< </b>${value}<b> ></b>`);
				}
				if (items[itemIndex + 1].type == "text-field") {
					setTimeout(() => {
						$(".selectMenu .selected input").focus();
					}, 5);
				}

				mp.trigger(`selectMenu.itemFocusChanged`, currentMenu.name, items[itemIndex + 1].text, itemValue, itemIndex + 1, valueIndex);
			} else if (e.keyCode == 37) { //left
				var items = currentMenu.items;
				var itemIndex = $(".selectMenu .selected").data("index");
				if (!items[itemIndex].values) return;

				var valueIndex = items[itemIndex].valueIndex || 0;
				if (valueIndex < 1) return;

				value = items[itemIndex].values[valueIndex - 1];
				items[itemIndex].valueIndex = valueIndex - 1;
				if (items[itemIndex].type != "choice-color")
					$(".selectMenu .selected td").eq(1).html(`<b>< </b>${value}<b> ></b>`);
				else {
					$(".selectMenu .selected .color-td").html(`<b>< </b><div></div><b> ></b>`);
					$(".selectMenu .selected div").css("background", value);
				}

				mp.trigger(`selectMenu.itemValueChanged`, currentMenu.name, items[itemIndex].text, value, itemIndex, valueIndex - 1);
			} else if (e.keyCode == 39) { //right
				var items = currentMenu.items;
				var itemIndex = $(".selectMenu .selected").data("index");
				if (!items[itemIndex].values) return;

				var valueIndex = items[itemIndex].valueIndex || 0;
				if (valueIndex >= items[itemIndex].values.length - 1)
					return;

				value = items[itemIndex].values[valueIndex + 1];
				items[itemIndex].valueIndex = valueIndex + 1;
				if (items[itemIndex].type != "choice-color")
					$(".selectMenu .selected td").eq(1).html(`<b>< </b>${value}<b> ></b>`);
				else {
					$(".selectMenu .selected .color-td").html(`<b>< </b><div></div><b> ></b>`);
					$(".selectMenu .selected div").css("background", value);
				}

				mp.trigger(`selectMenu.itemValueChanged`, currentMenu.name, items[itemIndex].text, value, itemIndex, valueIndex + 1);
			} else if (e.keyCode == 13) { //enter
				var items = currentMenu.items;
				var itemIndex = $(".selectMenu .selected").data("index");
				var itemValue = null;
				if (items[itemIndex].valueIndex == null && items[itemIndex].values) items[itemIndex].valueIndex = 0;
				var valueIndex = (items[itemIndex].valueIndex == null) ? -1 : items[itemIndex].valueIndex;
				if (valueIndex != -1 && items[itemIndex].values) itemValue = items[itemIndex].values[valueIndex];
				if (itemSelectedHandlers[currentMenu.name]) return itemSelectedHandlers[currentMenu.name](items[itemIndex - 1].text, items[itemIndex].text, itemValue, itemIndex);
				mp.trigger(`selectMenu.itemSelected`, currentMenu.name, items[itemIndex].text, itemValue, itemIndex);
			} else if (e.keyCode == 8) { //backspace
				var items = currentMenu.items;
				var itemIndex = $(".selectMenu .selected").data("index");
				var itemValue = null;
				var valueIndex = items[itemIndex].valueIndex || -1;
				if (valueIndex != -1) itemValue = items[itemIndex].values[valueIndex];

				mp.trigger(`selectMenu.backspacePressed`, currentMenu.name, items[itemIndex].text, itemValue, itemIndex);
			}
		},
		getValue: (menuName, itemName) => {
			if (!menus[menuName]) return name;
			var items = menus[menuName].items;
			for (var i = 0; i < items.length; i++)
				if (items[i].text == itemName) return items[i].value;

			return null;
		},
	};

	selectMenuAPI.init();
	//selectMenuAPI.show("test");
});

function setMotherImage(index) {
	$(`.selectMenu .family-preview img:eq(0)`).attr("src", `img/customization/parent/female_${index}.png`);
}

function setFatherImage(index) {
	$(`.selectMenu .family-preview img:eq(1)`).attr("src", `img/customization/parent/male_${index}.png`);
}
