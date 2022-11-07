import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddtrolleyComponent } from './addtrolley.component';

describe('AddtrolleyComponent', () => {
  let component: AddtrolleyComponent;
  let fixture: ComponentFixture<AddtrolleyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddtrolleyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddtrolleyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
