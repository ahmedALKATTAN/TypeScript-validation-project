// Code goes here!
// projectState mangment Class

class ProjectState {
     private projects: any[] = [];
     private static instance: ProjectState; // same type of classs
     private listeners: any[] = [];

     private constructor() {}
     static getInstance() {
          if (this.instance) {
               return this.instance;
          }
          this.instance = new ProjectState();
          return this.instance;
     }

     addProject(title: string, description: string, numOfPeople: number) {
          const newProject = {
               id: Math.random().toString(),
               title: title,
               description: description,
               people: numOfPeople,
          };

          this.projects.push(newProject);
          for (const listenerFn of this.listeners) {
               listenerFn(this.projects.slice());
          }
     }

     addListener(listenerFn: Function) {
          this.listeners.push(listenerFn);
     }
}

const projectState = ProjectState.getInstance();
//Validation method

interface Validatable {
     value: string | number;
     required?: boolean;
     minLength?: number;
     maxLength?: number;
     min?: number;
     max?: number;
}

function validate(validatableInput: Validatable) {
     let isValid = true;
     if (validatableInput.required) {
          isValid =
               isValid && validatableInput.value.toString().trim().length !== 0;
     }
     if (
          validatableInput.minLength != null &&
          typeof validatableInput.value === "string"
     ) {
          isValid =
               isValid &&
               validatableInput.value.length >= validatableInput.minLength;
     }
     if (
          validatableInput.maxLength != null &&
          typeof validatableInput.value === "string"
     ) {
          isValid =
               isValid &&
               validatableInput.value.length <= validatableInput.maxLength;
     }
     if (
          validatableInput.min != null &&
          typeof validatableInput.value === "number"
     ) {
          isValid = isValid && validatableInput.value >= validatableInput.min;
     }
     if (
          validatableInput.max != null &&
          typeof validatableInput.value === "number"
     ) {
          isValid = isValid && validatableInput.value <= validatableInput.max;
     }
     return isValid;
}
//autbind decorator

function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
     const orginalMethod = descriptor.value;
     const adjDescriptor: PropertyDescriptor = {
          configurable: true,
          get() {
               {
                    const boundFn = orginalMethod.bind(this);
                    return boundFn;
               }
          },
     };

     return adjDescriptor;
}
// project  list class

class ProjecList {
     // render the elements ov the active and finsished lists
     templateElement: HTMLTemplateElement; // main templet
     hostElement: HTMLDivElement; // select the div
     element: HTMLElement; // select the form
     assignedProjects: any[];
     constructor(private type: "active" | "finished") {
          this.assignedProjects = [];
          this.templateElement = document.getElementById(
               "project-list"
          )! as HTMLTemplateElement;
          this.hostElement = document.getElementById("app")! as HTMLDivElement; // put the app
          const importedNode = document.importNode(
               this.templateElement.content,
               true
          );

          this.element = importedNode.firstElementChild as HTMLElement;
          this.element.id = `${this.type}-projects`; // set the css to the form
          projectState.addListener((projects: any[]) => {
               this.assignedProjects = projects;
               this.renderProjects();
          }); // whe shpuld pass function to call
          this.attach();
          this.renderContent();
     }
     private renderProjects() {
          const listEl = document.getElementById(
               `${this.type}-projects-list`
          )! as HTMLUListElement;

          for (const prjItem of this.assignedProjects) {
               const listItem = document.createElement("li");
               listItem.textContent = prjItem.title;
               listEl.appendChild(listItem);
          }
     }
     private renderContent() {
          const listId = `${this.type}-projects-list`;
          this.element.querySelector("ul")!.id = listId;
          this.element.querySelector("h2")!.textContent =
               this.type.toUpperCase() + " PROJECTS";
     }
     private attach() {
          this.hostElement.insertAdjacentElement("beforeend", this.element);
     }
}

//project class
class ProjectInput {
     templateElement: HTMLTemplateElement; // main templet
     hostElement: HTMLDivElement; // select the div
     element: HTMLFormElement; // select the form

     titleInputElement: HTMLInputElement;
     descriptionInputElement: HTMLInputElement;
     peopeleInputElement: HTMLInputElement;
     constructor() {
          this.templateElement = document.getElementById(
               "project-input"
          )! as HTMLTemplateElement;
          this.hostElement = document.getElementById("app")! as HTMLDivElement; // put the app
          const importedNode = document.importNode(
               this.templateElement.content,
               true
          );

          this.element = importedNode.firstElementChild as HTMLFormElement;
          this.element.id = "user-input"; // set the css to the form

          // get the data from the dom
          this.titleInputElement = this.element.querySelector(
               "#title"
          ) as HTMLInputElement;
          this.descriptionInputElement = this.element.querySelector(
               "#description"
          ) as HTMLInputElement;
          this.peopeleInputElement = this.element.querySelector(
               "#people"
          ) as HTMLInputElement;

          this.configure();
          this.attach(); // attach the form
     }

     private attach() {
          // attach the templet on the DOM
          this.hostElement.insertAdjacentElement("afterbegin", this.element);
     }

     private gatherUserInput(): [string, string, number] | void {
          const enteredTitle = this.titleInputElement.value;
          const enteredDescription = this.descriptionInputElement.value;
          const enteredPeopele = this.peopeleInputElement.value;

          const titleValidatable: Validatable = {
               value: enteredTitle,
               required: true,
          };
          const descriptionValidatable: Validatable = {
               value: enteredDescription,
               required: true,
               minLength: 5,
          };
          const peopleValidatable: Validatable = {
               value: +enteredPeopele,
               required: true,
               min: 1,
               max: 5,
          };

          if (
               !validate(titleValidatable) ||
               !validate(descriptionValidatable) ||
               !validate(peopleValidatable)
          ) {
               alert("Invalid input, please try again!");
               return;
          } else {
               return [enteredTitle, enteredDescription, +enteredPeopele];
          }
     }

     private clearInputs() {
          this.titleInputElement.value = "";
          this.descriptionInputElement.value = "";
          this.peopeleInputElement.value = "";
     }
     @autobind
     private submitHandler(event: Event) {
          // take the values of(title,people,number)

          event.preventDefault();
          const userInput = this.gatherUserInput();
          if (Array.isArray(userInput)) {
               const [title, description, people] = userInput;
               projectState.addProject(title, description, people);

               this.clearInputs();
          }
     }

     private configure() {
          this.element.addEventListener(
               "submit",
               this.submitHandler.bind(this)
          ); // listen to button selection or on click
     }
}

const porjectInput = new ProjectInput();
const activeProjectList = new ProjecList("active");
const finsishedProjectList = new ProjecList("finished");
