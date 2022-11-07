import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewTrolleyComponent } from './add-new-trolley.component';

describe('AddNewTrolleyComponent', () => {
  let component: AddNewTrolleyComponent;
  let fixture: ComponentFixture<AddNewTrolleyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewTrolleyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewTrolleyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
