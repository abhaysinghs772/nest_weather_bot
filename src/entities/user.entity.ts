import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

// {
//     message_id: 7,
//     from: {
//       id: 6112645021,
//       is_bot: false,
//       first_name: '..',
//       last_name: '..',
//       language_code: 'en'
//     },
//     chat: {
//       id: 6112645021,
//       first_name: '..',
//       last_name: '..',
//       type: 'private'
//     },
//     date: 1690751848,
//     text: '/subscribe delhi',
//     entities: [ { offset: 0, length: 10, type: 'bot_command' } ]
//   }

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    user_id: number // db's id 

    @Column()
    chat_id: number

    @Column()
    telegram_user_id: number // telegram's user id  === chat id 

    @Column()
    first_name: string
    
    @Column()
    last_name: string
    
    @Column()
    language_code: string
    
    @Column()
    is_bot: boolean

    @Column()
    isSubscribed: boolean
    
    @Column()
    city: string

    @Column()
    subscribed_at: Date
    
    @Column({ nullable: true })
    updated_at: Date
}