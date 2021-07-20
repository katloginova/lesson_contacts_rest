'use strict';

const CONTACTS_URL = 'https://5dd3d5ba8b5e080014dc4bfa.mockapi.io/users/';

const LIST_ITEM_CLASS = 'list__item';
const DELETE_BTN_CLASS = 'delete__btn';
const EDIT_BTN_CLASS = 'edit__btn';



const contactTemplate = document.querySelector('#contactTemplate').innerHTML;
const listContacts = document.querySelector('#listContacts');
const contactForm = document.querySelector('#contactForm');
const nameInput = document.querySelector('#adderName');
const phoneInput = document.querySelector('#adderPhone');
const emailInput = document.querySelector('#adderEmail');
const idInput = document.querySelector('#idContactInput');


let contacts = [];


contactForm.addEventListener('submit', onContactSubmit);
listContacts.addEventListener('click', onListContactsClick);


init();

function onContactSubmit(e) {
    e.preventDefault();

    submitForm();
    // resetForms();

}

function onListContactsClick(e) {
    const idContact = getElementId(e.target);

    switch (true) {
        case (e.target.classList.contains(DELETE_BTN_CLASS)):
            deleteContact(idContact);
            break;
        case (e.target.classList.contains(EDIT_BTN_CLASS)):
            fillForm(idContact);
            break;
    }
}

function init() {
    fetchContacts();
}

function fetchContacts() {
    fetch(CONTACTS_URL)
        .then((resp) => resp.json())
        .then(setContacts)
        .then(renderListContacts);
}

function setContacts(data) {
    return (contacts = data);
}

function renderListContacts(list) {
    listContacts.innerHTML = list.map(getContactHtml).join('');
}

function getContactHtml({
    name,
    phone,
    email,
    id
}) {
    return contactTemplate
        .replace('{{name}}', name)
        .replace('{{phone}}', phone)
        .replace('{{email}}', email)
        .replace('{{id}}', id);
}

function submitForm() {
    const contact = getFormData();

    if (isInputsInvalid()) {
        return;
    }

    if (!contact.id) {
        createContact(contact);
    } else {
        editContact(contact);
    }

    resetForms();
}

function getFormData() {
    return {
        name: nameInput.value,
        phone: phoneInput.value,
        email: emailInput.value,
        id: idInput.value,
    };
}

function isInputsInvalid() {
    return (
        nameInput.value === '' ||
        phoneInput.value === '' ||
        emailInput.value === ''
    );
}

function resetForms() {
    nameInput.value = '';
    phoneInput.value = '';
    emailInput.value = '';
}

function createContact(contact) {
    delete contact.id;

    fetch(CONTACTS_URL, {
            method: 'POST',
            body: JSON.stringify(contact),
            headers: {
                'Content-type': 'application/json'
            },
        }).then((resp) => resp.json())
        .then(addContact);
}

function addContact(contact) {
    contacts.push(contact);
    renderListContacts(contacts);
}

function editContact(contact) {
    fetch(CONTACTS_URL + contact.id, {
        method: 'PUT',
        body: JSON.stringify(contact),
        headers: {
            'Content-type': 'application/json'
        },
    });

    contacts = contacts.map((item) => (item.id != contact.id) ? item : contact);

    renderListContacts(contacts);
}


function getElementId(elem) {
    return elem.closest('.' + LIST_ITEM_CLASS).dataset.id;
}

function deleteContact(id) {
    fetch(CONTACTS_URL + id, {
        method: 'DELETE',
    }).then(() => {
        contacts = contacts.filter((contact) => contact.id !== id);
        renderListContacts(contacts);
    });
}

function fillForm(id) {
    const editedContact = contacts.find((contact) => contact.id === id);

    nameInput.value = editedContact.name;
    phoneInput.value = editedContact.phone;
    emailInput.value = editedContact.email;
    idInput.value = editedContact.id;
}