const infos = document.querySelectorAll(".Animation-info");
const closeInfos = document.querySelectorAll(".Animation-closeInfo");
const fieldErrs = document.querySelectorAll(".fieldErr");
const fieldErrTexts = document.querySelectorAll(".fieldErrText");
const inputBox = document.querySelectorAll(".Input-box");
const inputNEW = document.getElementById("inputNEW");

const field = {
    dni: false,
    //scanner: false,
    name: false,
    lastname: false
    //direction: false,
    //population: false,
    //modile: false,
    //landline: false,
    //email: false,
};

const expresiones = {
    dni: /^[a-zA-Z0-9\_\-]{4,16}$/, // Letras, numeros, guion y guion_bajo
    name: /^[a-zA-ZÀ-ÿ\s]{4,40}$/, // Letras, numeros, guion y guion_bajo
    lastname: /^[a-zA-ZÀ-ÿ\s]{4,40}$/ // Letras y espacios, pueden llevar acentos.
    //password: /^.{5,20}$/, // 4 a 20 digitos.
    //email: /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/,
    //email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    //phone: /^\d{7,14}$/ // 7 a 14 numeros.
};

const textError = {
    dni:
        "[ ERROR ] : The username must be between 4 and 16 digits and can only contain numbers, letters, and underscores and cannot contain spaces.",
    name:
        "[ ERROR ] : The format Email address is incorrect, the email can only contain letters, numbers, periods, hyphens and underscores.",
    lastname:
        "[ ERROR ] : The username must be between 4 and 16 digits and can only contain numbers, letters, and underscores and cannot contain spaces."
};

async function dataPartner() {
    const index = selectDni.selectedIndex;
    const actualDate = new Date();
    const date = moment(actualDate).format("YYYY-MM-DD HH:mm");
    const data = { 
        inputPartnerID: $.trim($("#partnerID").val()),
        inputDni: $.trim($("#inputDni").val()), 
        inputName: $.trim($("#inputName").val()), 
        inputScanner: $.trim($("#inputScanner").val()), 
        inputLastname: $.trim($("#inputLastname").val()), 
        inputDirection: $.trim($("#inputDirection").val()), 
        inputPopulation: $.trim($("#inputPopulation").val()), 
        inputPhone: $.trim($("#inputPhone").val()), 
        inputPhoneLandline: $.trim($("#inputPhoneLandline").val()), 
        inputEmail: $.trim($("#inputEmail").val()), 
        actualDate: date, 
        updateDate: date };
    if (inputDniCheck.checked) {
        if (index === -1 || index === undefined) return;
        if (index === 0) {
            window.alert("Please select a DNI, to add to your partner list.");
            return;
        }
        const opcionSeleccionada = selectDni.options[index];
        let idPartnerFamily = opcionSeleccionada.value;
        let dniPartner = opcionSeleccionada.text;
        data.partnerID = idPartnerFamily;
        data.partnerDni = dniPartner;
        addNewPartner(data);
        selectDni.focus();
    } else {
        //const opcionSeleccionada = selectDni.options[index];
        let idPartnerFamily = null

        //TODO AQUI CAMBIAR 🍒
        let dniPartner = "73275889M";
        data.partnerID = idPartnerFamily;
        data.partnerDni = dniPartner;
        addNewPartner(data);
    }
}

var chageDni = false;
var chageName = false;
var chageLastname = false;

// TODO ✅ VALIDAR FORMULARIOS
async function correctForms(e) {
    e.preventDefault();
    if (inputNEW.checked) {
        if (field.dni && field.name && field.lastname) {
            dataPartner();
        } else {
            window.alert("There are items required your attention.");
            if (!field.dni) {
                inputDni.focus();
                inputDni.select();
                inputDni.classList.add("isError");
                document.getElementById("infoDni").classList.add("isVisible");
                return;
            } else if (!field.name) {
                inputName.focus();
                inputName.select();
                inputName.classList.add("isError");
                document.getElementById("infoName").classList.add("isVisible");
                return;
            } else if (!field.lastname) {
                inputLastname.focus();
                inputLastname.select();
                inputLastname.classList.add("isError");
                document.getElementById("infoLastname").classList.add("isVisible");
                return;
            }
        }
    } else {
        $("#inputDni").on("change", () => {
            chageDni = true;
        });
        $("#inputName").on("change", () => {
            chageName = true;
        });
        $("#inputLastname").on("change", () => {
            chageLastname = true;
        });
        if (chageDni || chageName || chageLastname) {
            if (field.dni || field.name || field.lastname) {
                dataPartner();
            } else {
                window.alert("There are items required your attention.");
                if (!field.dni) {
                    inputDni.focus();
                    inputDni.select();
                    inputDni.classList.add("isError");
                    document
                        .getElementById("infoDni")
                        .classList.add("isVisible");
                    return;
                } else if (!field.name) {
                    inputName.focus();
                    inputName.select();
                    inputName.classList.add("isError");
                    document
                        .getElementById("infoName")
                        .classList.add("isVisible");
                    return;
                } else if (!field.lastname) {
                    inputLastname.focus();
                    inputLastname.select();
                    inputLastname.classList.add("isError");
                    document
                        .getElementById("infoLastname")
                        .classList.add("isVisible");
                    return;
                }
            }
        } else {
            dataPartner();
        }
    }
}

//TODO ✅ ADD NEW PARTNER
async function addNewPartner(data) {
    let idPartner = data.idPartnerFamily;
    let partnerID = data.inputPartnerID;
    if (inputNEW.checked) {
        const urlAddPartner = `/api/partners/add/${idPartner}`;
        fetch(urlAddPartner, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(data => responseAddPartner(data))
            .catch(error => console.error(error));
    } else {
        console.log("UPDATE", data);
        const urlUpdate = `/api/partners/update/${partnerID}`;
        fetch(urlUpdate, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
            })
            .then(response => response.json())
            .then(data => responseAddPartner(data))
            .catch(error => console.error(error));
    }
}

//TODO ✅ RESPONSE ADD PARTNER
async function responseAddPartner(data) {
    const success = data.success;
    if (success) {
        Swal.fire({
            icon: "success",
            title: "Success",
            text: data.messageSuccess,
            backdrop: "#2C3333",
            timer: 5000,
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#474E68",
            confirmButtonText: "OK",
            showClass: {
                popup: "animate__animated animate__fadeInDown"
            },
            hideClass: {
                popup: "animate__animated animate__fadeOutUp"
            }
        }).then(response => {
            $("#selectDni").html("");
            try {
                formAddPartner.reset();
            } catch (error) { }
            try {
                formEditPartner.reset();
            } catch (error) { }
            familyLink.classList.remove("isEnable");
            inputDni.focus();
        });
    } else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: data.errorMessage,
            backdrop: "#2C3333",
            timer: 5000,
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#474E68",
            confirmButtonText: "OK",
            showClass: {
                popup: "animate__animated animate__fadeInDown"
            },
            hideClass: {
                popup: "animate__animated animate__fadeOutUp"
            }
        }).then(() => {
            inputDni.focus();
            inputDni.select();
        });
    }
}

//TODO ✅ VALIDAR FIELDS
async function validateField(
    expresion,
    input,
    fieldError,
    fieldErrorText,
    textError,
    inputField,
    info,
    closeInfo
) {
    if (!expresion.test(input.value.trim())) {
        input.classList.add("isError");
        document.getElementById(info).classList.add("isVisible");
        field[inputField] = false;
    } else {
        document.getElementById(fieldError).classList.remove("isActive");
        document.getElementById(fieldErrorText).innerHTML = "";
        input.classList.remove("isError");
        document.getElementById(info).classList.remove("isVisible");
        document.getElementById(closeInfo).classList.remove("isVisible");
        field[inputField] = true;
    }

    infos.forEach((info, i) => {
        infos[i].addEventListener("click", () => {
            inputBox[i].classList.add("isActiveError");
            inputBox[i + 1].classList.add("isActiveError");
            fieldErrs[i].classList.add("isActive");
            fieldErrTexts[i].innerHTML = textError;
            infos[i].classList.remove("isVisible");
            closeInfos[i].classList.add("isVisible");
        });
    });

    closeInfos.forEach((info, i) => {
        closeInfos[i].addEventListener("click", () => {
            inputBox[i].classList.remove("isActiveError");
            inputBox[i + 1].classList.remove("isActiveError");
            fieldErrs[i].classList.remove("isActive");
            fieldErrTexts[i].innerHTML = "";
            closeInfos[i].classList.remove("isVisible");
        });
    });
}

//TODO ✅ VALIDACIONES EXPRESSIONES
async function fieldEmpty(
    expression, // EXPRESION DEL INPUT
    input, // EL IMPUT
    errorDivValidation, //EL DIV DODE MUESTRA EL ERROR
    errorInputText, // EL LABEL DEL ERROR
    textError, // EL TEXTO DEL ERROR
    inputField, //SI EL FIELD INPUT SEA TRUE O FALSE
    info, //BOTON QUE MUESTRA EL ERROR
    closeInfo // BOTON QUE CIERRA EL ERROR
) {
    if (input.value.trim() !== "") {
        await validateField(
            expression,
            input,
            errorDivValidation,
            errorInputText,
            textError,
            inputField,
            info,
            closeInfo
        );
    } else {
        document.getElementById(errorDivValidation).classList.remove("isActive");
        document.getElementById(errorInputText).innerHTML = "";
        input.classList.remove("isError");
        document.getElementById(info).classList.remove("isVisible");
        document.getElementById(closeInfo).classList.remove("isVisible");
    }
    return;
}

//TODO ✅ VALIDACIONES INPUTS PARTNERS
const validateForms = async e => {
    switch (e.target.name) {
        case "inputDni":
            await fieldEmpty(
                expresiones.dni,
                e.target,
                "validationDni",
                "errorDni",
                textError.dni,
                "dni",
                "infoDni",
                "closeInfoDni"
            );
            break;
        case "inputName":
            await fieldEmpty(
                expresiones.name,
                e.target,
                "validationName",
                "errorName",
                textError.name,
                "name",
                "infoName",
                "closeInfoName"
            );
            break;
        case "inputLastname":
            await fieldEmpty(
                expresiones.lastname,
                e.target,
                "validationLastname",
                "errorLastname",
                textError.lastname,
                "lastname",
                "infoLastname",
                "closeInfoLastname"
            );
            break;
        /*
            case "inputPassNew":
                let textErrorPassNew = "Error: The password does not meet the requirements of the password policy, it must be between 5 and 20 digits, it can contain letters, numbers and special characters.";
                await fieldEmpty(expresiones.password, e.target, 'validationPassNew', 'errorPassNew', textErrorPassNew, 'pass', 'infoPass', 'closeInfoPass');
                validarPassword();
                break;
            case "inputPassNewRepeat":
                validarPassword();
                break;
            */
    }
};

//TODO ✅ RECORRER TODO LOS INPUTS DEL FORMULARIO
inputs.forEach((input, i) => {
    inputs.forEach((input, i) => {
        input.addEventListener("blur", validateForms);
        input.addEventListener("keyup", validateForms);
        input.addEventListener("keypress", e => {
            if (e.key === "Enter") {
                validateForms;
            }
        });
    });
});

function cerrar() {
    window.location.href = "/workspace/partners";
}

try {
    inputDniCheck.addEventListener("change", () => {
        activeSelectDniFamily();
    });
} catch (error) { }
