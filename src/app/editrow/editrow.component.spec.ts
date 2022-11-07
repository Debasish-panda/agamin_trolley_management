import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditrowComponent } from './editrow.component';

describe('EditrowComponent', () => {
  let component: EditrowComponent;
  let fixture: ComponentFixture<EditrowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditrowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
