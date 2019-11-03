import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableVentesComponent } from './table-ventes.component';

describe('TableVentesComponent', () => {
  let component: TableVentesComponent;
  let fixture: ComponentFixture<TableVentesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableVentesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableVentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
