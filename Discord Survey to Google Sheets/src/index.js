import { config } from 'dotenv';
import {
  ActionRowBuilder,
  Client,
  GatewayIntentBits,
  InteractionType,
  ModalBuilder,
  Routes,
  SelectMenuBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import { REST } from '@discordjs/rest';
import OrderCommand from './commands/order.js';
import RolesCommand from './commands/roles.js';
import UsersCommand from './commands/user.js';
import ChannelsCommand from './commands/channel.js';
import BanCommand from './commands/ban.js';
import RegisterCommand from './commands/register.js';


config();

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const rest = new REST({ version: '10' }).setToken(TOKEN);

client.on('ready', () => console.log(`${client.user.tag} has logged in!`));

client.on('interactionCreate', (interaction) => {
  if (interaction.isChatInputCommand()) {
    console.log('Chat Command');
    if (interaction.commandName === 'order') {
      const actionRowComponent = new ActionRowBuilder().setComponents(
        new SelectMenuBuilder().setCustomId('food_options').setOptions([
          { label: 'Cake', value: 'cake' },
          { label: 'Pizza', value: 'pizza' },
          { label: 'Sushi', value: 'sushi' },
        ])
      );
      const actionRowDrinkMenu = new ActionRowBuilder().setComponents(
        new SelectMenuBuilder().setCustomId('drink_options').setOptions([
          { label: 'Orange Juice', value: 'orange_juice' },
          { label: 'Coca-Cola', value: 'coca_cola' },
        ])
      );
      interaction.reply({
        components: [actionRowComponent.toJSON(), actionRowDrinkMenu.toJSON()],
      });
    } else if (interaction.commandName === 'signup') {
      const modal = new ModalBuilder()
        .setTitle('Signup for Newsletter & Airdrops')
        .setCustomId('registerUserModal')
        .setComponents(
          new ActionRowBuilder().setComponents(
            new TextInputBuilder()
              .setLabel('name')
              .setCustomId('name')
              .setStyle(TextInputStyle.Short)
          ),
          new ActionRowBuilder().setComponents(
            new TextInputBuilder()
              .setLabel('Email')
              .setCustomId('email')
              .setStyle(TextInputStyle.Short)
          ),
          new ActionRowBuilder().setComponents(
            new TextInputBuilder()
              .setLabel('Wallet Address')
              .setCustomId('walletAddress')
              .setStyle(TextInputStyle.Short).setRequired(false)
          )
        );

      interaction.showModal(modal);
    }
  } else if (interaction.isSelectMenu()) {
    console.log('Select Menu');
    if (interaction.customId === 'food_options') {
      console.log(interaction.component);
    } else if (interaction.customId === 'drink_options') {
    }
  } else if (interaction.type === InteractionType.ModalSubmit) {
    console.log('Modal Submitted...');
    if (interaction.customId === 'registerUserModal') {
      const nameStorage = interaction.fields.getTextInputValue('name');
      console.log('this is the name: ', nameStorage);
      console.log(interaction.fields.getTextInputValue('email'));
      console.log(interaction.fields.getTextInputValue('walletAddress'));
      console.log(interaction.createdAt.toDateString());
      console.log(interaction.user.tag);
      console.log(interaction.guild.name);
      interaction.reply({
        content: 'Submission success.', ephemeral: true,
      },);
    }
  }
});

async function main() {
  const commands = [
    OrderCommand,
    RolesCommand,
    UsersCommand,
    ChannelsCommand,
    BanCommand,
    RegisterCommand,
  ];
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    });
    client.login(TOKEN);
  } catch (err) {
    console.log(err);
  }
}

main();
