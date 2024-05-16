import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMateriaComponent } from './edit-materia.component';

describe('EditMateriaComponent', () => {
  let component: EditMateriaComponent;
  let fixture: ComponentFixture<EditMateriaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditMateriaComponent]
    });
    fixture = TestBed.createComponent(EditMateriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
