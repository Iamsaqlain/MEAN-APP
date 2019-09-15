import { NgModule } from '@angular/core';
import { PostListComponent } from './post-list/post-list.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from './../angular-material.module';
import { CommonModule } from '@angular/common';

@NgModule({
declarations: [
PostListComponent,
PostCreateComponent
],
imports: [
CommonModule,
ReactiveFormsModule,
RouterModule,
AngularMaterialModule
]
})
export class PostModule{

}
