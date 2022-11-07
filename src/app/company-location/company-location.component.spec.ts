import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanylocationComponent } from './company-location.component';

describe('CompanylocationComponent', () => {
  let component: CompanylocationComponent;
  let fixture: ComponentFixture<CompanylocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanylocationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanylocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
