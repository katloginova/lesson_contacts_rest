'use strict';

const CONTACTS_URL = 'https://5dd3d5ba8b5e080014dc4bfa.mockapi.io/users/';

const LIST_ITEM_CLASS = 'list__item';
const DELETE_BTN_CLASS = 'delete__btn';


const contactTemplate = document.querySelector('#contactTemplate').innerHTML;
const listContacts = document.querySelector('#listContacts');
const contactForm = document.querySelector('#contactForm');
const newName = document.querySelector('#adderName');
const newPhone = document.querySelector('#adderPhone');
const newEmail = document.querySelector('#adderEmail');


let contacts = [];


contactForm.addEventListener('submit', onContactSubmit);
listContacts.addEventListener('click', onListContactsClick);


init();

function onContactSubmit(e) {
    e.preventDefault();

    submitForm();
}

function onListContactsClick(e) {
    const contactId = getElementById(e.target);

    switch (true) {
        case (e.target.classList.contains(DELETE_BTN_CLASS)):
            deleteContact(contactId);
            break;
    }

    console.log(contactId);
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
    const newContact = getFormData();

    if (isInputsInvalid()) {
        return;
    }
    console.log(newContact);

    createContact(newContact);
    resetForms();
}

function getFormData() {
    return {
        name: newName.value,
        phone: newPhone.value,
        email: newEmail.value,
    };
}

function isInputsInvalid() {
    return (
        newName.value === '' ||
        newEmail.value === '' ||
        newPhone.value === ''
    );
}

function resetForms() {
    newName.value = '';
    newPhone.value = '';
    newEmail.value = '';
}

function createContact(newContact) {
    fetch(CONTACTS_URL, {
            method: 'POST',
            body: JSON.stringify(newContact),
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

function getElementById(elem) {
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
