import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Tasks } from '../api/tasks.js';

import './task.js';

import './body.html';
  
 
Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
});
 

Template.body.helpers({
 /*  ANTES ERA UN ARRAY
 
 tasks: [
    { text: 'This is task 1' },
    { text: 'This is task 2' },
    { text: 'This is task 123' },
  ],*/
 /* AHORA SON DATOS QUE DEVUELVE UNA LLAMADA A UNA FUNCION DE MONGODB */ 
   tasks() {
	const instance = Template.instance();
    if (instance.state.get('hideCompleted')) {
      // If hide completed is checked, filter tasks
      return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
    }
    // Otherwise, return all of the tasks
    return Tasks.find({}, { sort: { createdAt: -1 } });
  },
  incompleteCount() {
    return Tasks.find({ checked: { $ne: true } }).count();
  },
});

//AÑADO LA GESTIÓN DE EVENTOS
Template.body.events({
  'submit .new-task'(event) {
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const text = target.text.value;
	const ciudad = "Barcelona";
	console.log(event);
    // Insert a task into the collection
    Tasks.insert({
      text,
	  ciudad,
	  createdAt: new Date(), // current time
    });
 
    // Clear form
    target.text.value = '';
  },
  
   'change .hide-completed input'(event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  },
});