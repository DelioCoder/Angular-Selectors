import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs';

import { PaisesService } from '../../services/paises.service';
import { PaisSmall } from '../../interfaces/paises.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this._fb.group({
    region  : [ '', Validators.required ],
    pais    : [ '', Validators.required ],
    frontera: [ '', Validators.required ]
  });

  // llenar selectores
  regiones  : string[]    = [];
  paises    : PaisSmall[] = [];
  fronteras : string[]    = [];

  // UI
  cargando: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private _paisesService: PaisesService
  ) { }

  ngOnInit(): void {

    this.regiones = this._paisesService.regiones;

    // this.miFormulario.get( 'region' )?.valueChanges
    //   .subscribe( region => {
    //     console.log(region);

    //     this._paisesService.getPaisesPorRegion( region )
    //       .subscribe( paises => {
    //         console.log(paises);
    //         this.paises = paises;
    //       } )
    //   });

    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap( _ => {
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
        }),
        switchMap( region => this._paisesService.getPaisesPorRegion( region ) )
      )
      .subscribe( paises => {
        this.paises   = paises;
        this.cargando = false;
      });

    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap( _ => {
          this.miFormulario.get('frontera')?.reset('');
          this.cargando = true;
        }),
        switchMap( codigo => this._paisesService.getPaisPorCodigo( codigo ) )
      )
      
      .subscribe( pais => {
        // this.fronteras = pais?.borders || [];
        if ( pais.length > 0 ) {
          this.fronteras  = pais[0]?.borders;
          this.cargando   = false;
        } else {
          this.fronteras  = [];
        }
      });

  }

  guardar() {
    console.log( this.miFormulario.value );
  }

}
