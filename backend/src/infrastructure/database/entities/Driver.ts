import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Ride } from './Ride';

@Entity('drivers')
export class Driver {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  vehicle: string;

  @Column()
  rating: number;

  @Column({ name: 'price_per_km', type: 'decimal', precision: 10, scale: 2 })
  pricePerKm: number;

  @Column({ name: 'min_km_required' })
  minKmRequired: number;

  @OneToMany(() => Ride, ride => ride.driver)
  rides: Ride[];
}