/// <reference path='base-componenet.ts'/>
/// <reference path='../decorators/autobind.ts'/>
/// <reference path='../state/project-state.ts'/>

/// <reference path='../models/project.ts'/>
/// <reference path='../models/drag-drop.ts'/>

namespace App {
     export class ProjecList
          extends Component<HTMLDivElement, HTMLElement>
          implements DragTarget
     {
          // render the elements ov the active and finsished lists

          assignedProjects: Project[];
          constructor(private type: "active" | "finished") {
               super("project-list", "app", false, `${type}-projects`);
               this.assignedProjects = [];
               this.configure();
               this.renderContent();
          }

          renderContent() {
               const listId = `${this.type}-projects-list`;
               this.element.querySelector("ul")!.id = listId;
               this.element.querySelector("h2")!.textContent =
                    this.type.toUpperCase() + " PROJECTS";
          }

          @autobind
          dragOverHandler(event: DragEvent) {
               if (event.dataTransfer?.types[0] === "text/plain") {
                    event.preventDefault();
                    const listEl = this.element.querySelector("ul")!;
                    listEl.classList.add("droppable");
               }
          }
          @autobind
          dropHandler(event: DragEvent) {
               const projId = event.dataTransfer!.getData("text/plain");
               projectState.moveProject(
                    projId,
                    this.type === "active"
                         ? ProjectStatus.Active
                         : ProjectStatus.Finished
               );
          }
          @autobind
          dragLeaveHandler(_: DragEvent) {
               const listEl = this.element.querySelector("ul")!;
               listEl.classList.remove("droppable");
          }

          configure() {
               this.element.addEventListener("dragover", this.dragOverHandler);
               this.element.addEventListener(
                    "dragleave",
                    this.dragLeaveHandler
               );
               this.element.addEventListener("drop", this.dropHandler);

               projectState.addListener((projects: Project[]) => {
                    const relevantProjects = projects.filter((proj) => {
                         if (this.type === "active") {
                              return proj.status === ProjectStatus.Active;
                         }
                         return proj.status === ProjectStatus.Finished;
                    });
                    this.assignedProjects = relevantProjects;
                    this.renderProjects();
               }); // whe shpuld pass function to call
          }
          private renderProjects() {
               const listEl = document.getElementById(
                    `${this.type}-projects-list`
               )! as HTMLUListElement;

               listEl.innerHTML = "";

               for (const prjItem of this.assignedProjects) {
                    new ProjectItem(
                         this.element.querySelector("ul")!.id,
                         prjItem
                    );
               }
          }
     }
}
