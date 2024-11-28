import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  CreateDateColumn,
  JoinColumn 
} from 'typeorm';
import { Driver } from './Driver';

@Entity('rides')
export class Ride {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'customer_id' })
  customerId: string;

  @Column()
  origin: string;

  @Column()
  destination: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  distance: number;

  @Column()
  duration: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Driver, driver => driver.rides)
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;

  @Column({ name: 'origin_latitude', type: 'decimal', precision: 10, scale: 8 })
  originLatitude: number;

  @Column({ name: 'origin_longitude', type: 'decimal', precision: 11, scale: 8 })
  originLongitude: number;

  @Column({ name: 'destination_latitude', type: 'decimal', precision: 10, scale: 8 })
  destinationLatitude: number;

  @Column({ name: 'destination_longitude', type: 'decimal', precision: 11, scale: 8 })
  destinationLongitude: number;
}