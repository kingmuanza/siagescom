import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecapVenteComponent } from './recap-vente.component';

describe('RecapVenteComponent', () => {
  let component: RecapVenteComponent;
  let fixture: ComponentFixture<RecapVenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecapVenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecapVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
