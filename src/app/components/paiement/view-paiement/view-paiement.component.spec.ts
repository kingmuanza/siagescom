import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPaiementComponent } from './view-paiement.component';

describe('ViewPaiementComponent', () => {
  let component: ViewPaiementComponent;
  let fixture: ComponentFixture<ViewPaiementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPaiementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPaiementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
