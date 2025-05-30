import { Paise } from 'src/paises/entities/paise.entity';
import{
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
}from 'typeorm'

//• id: clave primaria auto numérica, INT PRIMARY KEY AUTO_INCREMENT
//• id_pais: entero, INT Llave foránea de la tabla paises
//• titulo: cadena de 250 caracteres, VARCHAR(250)
//• sinopsis  : cadena de 5000 caracteres, VARCHAR(5000)
//• director: cadena de 100 caracteres, VARCHAR(100)
//• temporadas: entero, INT
//• fecha_estreno: fecha, DATE
//• idioma_principal: cadena de 50 caracteres, VARCHAR(50)

@Entity('series')
export class Series {

    @PrimaryGeneratedColumn('identity')
    id: number;

    @Column('integer', { name:'id_pais' })
    idPais: number;

    @Column('varchar', { length: 250 })
    titulo: string;

    @Column('varchar', { length: 5000 })
    sinopsis: string;

    @Column('varchar', { length: 100 })
    director: string;

    @Column('int')
    temporadas: number;
    
    @Column('date', { name: 'fecha_estreno' })
    fechaEstreno: Date;
/*
    @Column('varchar', { name: 'idioma_principal', length: 50, nullable: true })
    idiomaPrincipal: string;
*/
    @CreateDateColumn({ name: 'fecha_creacion' })
    fechaCreacion: Date;

    @UpdateDateColumn({ name: 'fecha_modificacion' })
    fechaModificacion: Date;

    @DeleteDateColumn({ name: 'fecha_eliminacion' })
    fechaEliminacion: Date;

    @ManyToOne(() => Paise, (paises) => paises.series)
    @JoinColumn({ name: 'id_pais', referencedColumnName: 'id' })
    pais: Paise;







}
