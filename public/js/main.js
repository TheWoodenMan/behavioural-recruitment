const recycleSymbol = document.querySelectorAll(".fa-recycle");
const trashSymbol = document.querySelectorAll(".fa-trash");

Array.from(recycleSymbol).forEach((el) => {
	el.addEventListener("click", replaceQuestion);
});

Array.from(trashSymbol).forEach((el) => {
	el.addEventListener("click", deleteQuestion);
});

async function replaceQuestion() {
	const questionText = this.parentNode.childNodes[1].innerText;

	try {
		const response = await fetch("replaceQuestion", {
			method: "post",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				"question": questionText,
			}),
		});
		const data = await response.json();
		console.log(data);
		location.reload();
	} catch (err) {
		console.log(err);
	}
}

async function deleteQuestion() {
	const questionId = this.parentNode.childNodes[1].id;
	console.log(this.parentNode.childNodes[1].id);
	try {
		const response = await fetch("deleteQuestion", {
			method: "delete",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ "idFromJS": questionId }),
		});

		const data = await response.json();
		console.log(data);
		location.reload();
	} catch (err) {
		throw new Error({ "error": err });
	}
}
