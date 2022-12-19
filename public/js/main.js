const recycleSymbol = document.querySelectorAll(".fa-recycle");
const trashSymbol = document.querySelectorAll(".fa-trash");

Array.from(recycleSymbol).forEach((el) => {
	el.addEventListener("click", replaceQuestion);
});

Array.from(trashSymbol).forEach((el) => {
	el.addEventListener("click", deleteQuestion);
});

async function replaceQuestion() {
	let data;

	const createNewLi = function (id, question) {
		const newLi = document.createElement("li");
		const newSpan = document.createElement("span");

		newSpan.id = id;
		newSpan.innerText = question;

		const iRec = document.createElement("i");
		const iTrash = document.createElement("i");

		iRec.classList.add("fa-solid");
		iRec.classList.add("fa-recycle");

		iTrash.classList.add("fa-solid");
		iTrash.classList.add("fa-trash");

		iRec.addEventListener("click", replaceQuestion);
		iTrash.addEventListener("click", deleteQuestion);

		newSpan.appendChild(iRec);
		newSpan.appendChild(iTrash);

		newLi.appendChild(newSpan);

		return newLi;
	};

	const getRandomQuestion = async function () {
		const returnObj = {};

		try {
			const response = await fetch("/replaceQuestion", {
				method: "post",
				headers: { "Content-Type": "application/json" }
			});

			if (!response.ok) {
				throw new Error(`Error! status: ${response.status}`);
			}

			const result = await response.json();

			returnObj._id = result._id;
			returnObj.question = result.question + " ";
		} catch (err) {
			console.log(err);
		}
		console.log(returnObj);
		return returnObj;
	};

	getRandomQuestion()
		.then((data) => {
			console.log(data);
			const newLi = createNewLi(data._id, data.question);

			this.parentNode.after(newLi);

			this.parentNode.remove();
		})
		.catch((err) => {
			console.log(err);
		});
}

async function deleteQuestion() {
	const questionId = this.parentNode.childNodes[1].id;
	console.log(this.parentNode.childNodes[1].id);
	try {
		const response = await fetch("/deleteQuestion", {
			method: "delete",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ "idFromJS": questionId })
		});

		const data = await response.json();
		console.log(data);
		location.reload();
	} catch (err) {
		throw new Error({ "error": err });
	}
}
