import { Component, DoCheck, Input, OnInit, ViewContainerRef } from "@angular/core";
import { QuestionSkeletonComponent } from "./components/skeleton.component";
import { AngularComponentFactory } from "./component-factory";

@Component({
  selector: "sv-ng-element-content",
  templateUrl: "./element-content.component.html",
  styleUrls: ["./element-content.component.scss"]
})
export class ElementContentComponent implements DoCheck {
  @Input() model: any;
  prevComponentName: string = "";
  constructor(public viewContainerRef: ViewContainerRef) {}
  public getComponentName(): string {
    if (
      this.model.customWidget &&
      !this.model.customWidget.widgetJson.isDefaultRender
    )
      return "survey-widget-" + this.model.customWidget.name;
    if (this.model.getType() === "panel" || this.model.isDefaultRendering()) {
      return this.model.getType() + "-question";
    }
    return this.model.getComponentName();
  }

  ngDoCheck() {
    if(this.prevComponentName!== this.getComponentName()) {
      this.viewContainerRef.clear();
      let componentRef = AngularComponentFactory.Instance.create(this.viewContainerRef, this.getComponentName());
      if(!componentRef) {
        componentRef = this.viewContainerRef.createComponent(QuestionSkeletonComponent) as any;
      }
      (componentRef.instance as any).model = this.model;
      this.prevComponentName = this.getComponentName();
    }
  }
}