namespace App {
     export abstract class Component<
          T extends HTMLElement,
          U extends HTMLElement
     > {
          templateElement: HTMLTemplateElement; // main templet
          hostElement: T; // select the div
          element: U; // select the form

          constructor(
               templateId: string,
               hostElementId: string,
               insertAtStart: boolean,
               newElementId?: string
          ) {
               this.templateElement = document.getElementById(
                    templateId
               )! as HTMLTemplateElement;
               this.hostElement = document.getElementById(hostElementId)! as T; // put the app
               const importedNode = document.importNode(
                    this.templateElement.content,
                    true
               );

               this.element = importedNode.firstElementChild as U;

               if (newElementId) {
                    this.element.id = newElementId; // set the css to the form
               }

               this.attach(insertAtStart);
          }

          private attach(insertAtBeginning: boolean) {
               this.hostElement.insertAdjacentElement(
                    insertAtBeginning ? "afterbegin" : "beforeend",
                    this.element
               );
          }

          // forcing each class who are inherithg from these method to have them

          abstract configure(): void;
          abstract renderContent(): void;
     }
}
