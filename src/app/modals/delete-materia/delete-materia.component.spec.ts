import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMateriaComponent } from './delete-materia.component';

describe('DeleteMateriaComponent', () => {
  let component: DeleteMateriaComponent;
  let fixture: ComponentFixture<DeleteMateriaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteMateriaComponent]
    });
    fixture = TestBed.createComponent(DeleteMateriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
