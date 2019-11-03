import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPaiementComponent } from './edit-paiement.component';

describe('EditPaiementComponent', () => {
  let component: EditPaiementComponent;
  let fixture: ComponentFixture<EditPaiementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPaiementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPaiementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
