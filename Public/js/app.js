//For button:
document.addEventListener('DOMContentLoaded', () => {
    var input = document.getElementById("name");

    input.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("submit").click();
        }
    });
});


