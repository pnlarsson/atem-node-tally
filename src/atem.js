'use strict';

// https://github.com/nrkno/tv-automation-atem-connection

const { Atem } = require('atem-connection')
const myAtem = new Atem()
myAtem.on('info', console.log)
myAtem.on('error', console.error)

myAtem.tallyState = {
  sourcePreview: 0,
  sourceProgram: 0,
}

myAtem.on('connected', () => {
	// myAtem.changeProgramInput(3).then(() => {
		// Fired once the atem has acknowledged the command
		// Note: the state likely hasnt updated yet, but will follow shortly
		// console.log('Program input set')
	// })
	console.log(myAtem.state);

	clearInterval(this.testDataInterval);
})

myAtem.on('stateChanged', (state, pathToChange) => {
	// console.log(state); // catch the ATEM state.
	// console.log(pathToChange); // catch the ATEM state.
});

myAtem.sendTestData = function() {
	var state = 'program';
	var source = getRandomInt(1, 4);

	if(getRandomInt(0, 2) > 0){
		state = 'preview';
	}

	if(state == 'preview'){
		myAtem.tallyState.sourcePreview = source;
	}else{
		myAtem.tallyState.sourceProgram = source;
	}

	console.log("state " + state + " source " + source);

  myAtem.emit('updateClients', source, state);
}

this.testDataInterval = setInterval(myAtem.sendTestData, 1500);

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

myAtem.on('receivedCommand', (command) => {
    // console.log(command);

    // if(command.rawName == 'TlSr'){
    //  console.log(command);
    // }

/*
    TallyBySourceCommand {
      flag: 0,
      rawName: 'TlSr',
      properties: {
        '0': { program: false, preview: false },
        '1': { program: true, preview: true },
        '2': { program: true, preview: false },
        '3': { program: false, preview: false },
        '4': { program: false, preview: false },
        '5': { program: false, preview: false },
        '6': { program: false, preview: false },
        '7': { program: false, preview: false },
        '8': { program: false, preview: false },
        '1000': { program: false, preview: false },
        '2001': { program: false, preview: false },
        '2002': { program: false, preview: false },
        '3010': { program: false, preview: false },
        '3011': { program: false, preview: false },
        '3020': { program: false, preview: false },
        '3021': { program: false, preview: false },
        '4010': { program: false, preview: false },
        '5010': { program: false, preview: false },
        '5020': { program: false, preview: false },
        '7001': { program: false, preview: false },
        '7002': { program: false, preview: false },
        '8001': { program: false, preview: false },
        '10010': { program: false, preview: false },
        '10011': { program: false, preview: false }
      },
      packetId: 177
    }

*/

  if(command.rawName == 'TlSr'){
    console.log(command.properties);

    let programs;
    let preview;

    // Iterate over the property names:
    for (let cameraId of Object.keys(command.properties)) {
        var row = command.properties[cameraId];
        console.log(cameraId, ' -> ', row);

        // if(row.program == true){
        //   programs
        // }

        if(cameraId == 2){
          console.log('camera 2 program: ', row.program, ' preview ', row.preview);
        }
    }
  }

  // if(command.rawName == 'PrgI' || command.rawName == 'PrvI'){
  //   console.log(command);
  // }

  /*
  ProgramInputUpdateCommand {
    flag: 0,
    rawName: 'PrgI',
    mixEffect: 0,
    properties: { source: 2 },
    packetId: 85
  }
*/

    if(command.rawName == 'PrgI'){
        myAtem.tallyState.sourceProgram = command.properties.source;

        console.log('PrgI got - source: ' + myAtem.tallyState.sourceProgram);

        myAtem.emit('updateClients', myAtem.tallyState.sourceProgram, 'program');
    }

    if(command.rawName == 'PrvI'){
        myAtem.tallyState.sourcePreview = command.properties.source;

        console.log('PrvI got - source: ' + myAtem.tallyState.sourcePreview);

        myAtem.emit('updateClients', myAtem.tallyState.sourcePreview, 'preview');
    }
});

module.exports = myAtem;

/*
AtemState {
  info: DeviceInfo {
    superSources: [],
    apiVersion: 131102,
    productIdentifier: 'ATEM Television Studio HD',
    model: 8,
    power: [ true ],
    capabilities: {
      MEs: 1,
      sources: 24,
      colorGenerators: 2,
      auxilliaries: 1,
      talkbackOutputs: 4,
      mediaPlayers: 2,
      serialPorts: 1,
      maxHyperdecks: 4,
      DVEs: 1,
      stingers: 0,
      hasSuperSources: false,
      superSources: 0,
      talkbackOverSDI: 1
    }
  },
  video: AtemVideoState {
    ME: { '0': [MixEffect] },
    downstreamKeyers: { '0': [Object], '1': [Object] },
    auxilliaries: { '0': 1000 },
    superSources: {}
  },
  audio: AtemAudioState {
    channels: [
      <1 empty item>, [Object],
      [Object],       [Object],
      [Object],       [Object],
      [Object],       [Object],
      [Object],       <992 empty items>,
      [Object],       <299 empty items>,
      [Object]
    ],
    master: { gain: 0, balance: 0, followFadeToBlack: false }
  },
  media: MediaState {
    stillPool: [
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object]
    ],
    clipPool: [],
    players: [ [Object], [Object] ]
  },
  inputs: [
    {
      inputId: 0,
      longName: 'Black',
      shortName: 'BLK',
      externalPorts: null,
      isExternal: false,
      externalPortType: 0,
      internalPortType: 1,
      sourceAvailability: 19,
      meAvailability: 1
    },
    {
      inputId: 1,
      longName: 'Camera 1',
      shortName: 'CAM1',
      externalPorts: [Array],
      isExternal: true,
      externalPortType: 2,
      internalPortType: 0,
      sourceAvailability: 19,
      meAvailability: 1
    },
    {
      inputId: 2,
      longName: 'Camera 2',
      shortName: 'CAM2',
      externalPorts: [Array],
      isExternal: true,
      externalPortType: 2,
      internalPortType: 0,
      sourceAvailability: 19,
      meAvailability: 1
    },
    {
      inputId: 3,
      longName: 'Camera 3',
      shortName: 'CAM3',
      externalPorts: [Array],
      isExternal: true,
      externalPortType: 2,
      internalPortType: 0,
      sourceAvailability: 19,
      meAvailability: 1
    },
    {
      inputId: 4,
      longName: 'Camera 4',
      shortName: 'CAM4',
      externalPorts: [Array],
      isExternal: true,
      externalPortType: 2,
      internalPortType: 0,
      sourceAvailability: 19,
      meAvailability: 1
    },
    {
      inputId: 5,
      longName: 'Camera 5',
      shortName: 'CAM5',
      externalPorts: [Array],
      isExternal: true,
      externalPortType: 1,
      internalPortType: 0,
      sourceAvailability: 19,
      meAvailability: 1
    },
    {
      inputId: 6,
      longName: 'Camera 6',
      shortName: 'CAM6',
      externalPorts: [Array],
      isExternal: true,
      externalPortType: 1,
      internalPortType: 0,
      sourceAvailability: 19,
      meAvailability: 1
    },
    {
      inputId: 7,
      longName: 'Camera 7',
      shortName: 'CAM7',
      externalPorts: [Array],
      isExternal: true,
      externalPortType: 1,
      internalPortType: 0,
      sourceAvailability: 19,
      meAvailability: 1
    },
    {
      inputId: 8,
      longName: 'Camera 8',
      shortName: 'CAM8',
      externalPorts: [Array],
      isExternal: true,
      externalPortType: 1,
      internalPortType: 0,
      sourceAvailability: 19,
      meAvailability: 1
    },
    <991 empty items>,
    {
      inputId: 1000,
      longName: 'Color Bars',
      shortName: 'BARS',
      externalPorts: null,
      isExternal: false,
      externalPortType: 0,
      internalPortType: 2,
      sourceAvailability: 19,
      meAvailability: 1
    },
    <1000 empty items>,
    {
      inputId: 2001,
      longName: 'Color 1',
      shortName: 'COL1',
      externalPorts: null,
      isExternal: false,
      externalPortType: 0,
      internalPortType: 3,
      sourceAvailability: 3,
      meAvailability: 1
    },
    {
      inputId: 2002,
      longName: 'Color 2',
      shortName: 'COL2',
      externalPorts: null,
      isExternal: false,
      externalPortType: 0,
      internalPortType: 3,
      sourceAvailability: 3,
      meAvailability: 1
    },
    <1007 empty items>,
    {
      inputId: 3010,
      longName: 'Media Player 1',
      shortName: 'MP1',
      externalPorts: null,
      isExternal: false,
      externalPortType: 0,
      internalPortType: 4,
      sourceAvailability: 19,
      meAvailability: 1
    },
    {
      inputId: 3011,
      longName: 'Media Player 1 Key',
      shortName: 'MP1K',
      externalPorts: null,
      isExternal: false,
      externalPortType: 0,
      internalPortType: 5,
      sourceAvailability: 19,
      meAvailability: 1
    },
    <8 empty items>,
    {
      inputId: 3020,
      longName: 'Media Player 2',
      shortName: 'MP2',
      externalPorts: null,
      isExternal: false,
      externalPortType: 0,
      internalPortType: 4,
      sourceAvailability: 19,
      meAvailability: 1
    },
    {
      inputId: 3021,
      longName: 'Media Player 2 Key',
      shortName: 'MP2K',
      externalPorts: null,
      isExternal: false,
      externalPortType: 0,
      internalPortType: 5,
      sourceAvailability: 19,
      meAvailability: 1
    },
    <988 empty items>,
    {
      inputId: 4010,
      longName: 'Key 1 Mask',
      shortName: 'M1K1',
      externalPorts: null,
      isExternal: false,
      externalPortType: 0,
      internalPortType: 130,
      sourceAvailability: 3,
      meAvailability: 0
    },
    <999 empty items>,
    {
      inputId: 5010,
      longName: 'DSK 1 Mask',
      shortName: 'DK1M',
      externalPorts: null,
      isExternal: false,
      externalPortType: 0,
      internalPortType: 130,
      sourceAvailability: 3,
      meAvailability: 0
    },
    <9 empty items>,
    {
      inputId: 5020,
      longName: 'DSK 2 Mask',
      shortName: 'DK2M',
      externalPorts: null,
      isExternal: false,
      externalPortType: 0,
      internalPortType: 130,
      sourceAvailability: 3,
      meAvailability: 0
    },
    <1980 empty items>,
    {
      inputId: 7001,
      longName: 'Clean Feed 1',
      shortName: 'CFD1',
      externalPorts: null,
      isExternal: false,
      externalPortType: 0,
      internalPortType: 128,
      sourceAvailability: 3,
      meAvailability: 0
    },
    {
      inputId: 7002,
      longName: 'Clean Feed 2',
      shortName: 'CFD2',
      externalPorts: null,
      isExternal: false,
      externalPortType: 0,
      internalPortType: 128,
      sourceAvailability: 3,
      meAvailability: 0
    },
    <998 empty items>,
    {
      inputId: 8001,
      longName: 'Auxiliary 1',
      shortName: 'AUX1',
      externalPorts: null,
      isExternal: false,
      externalPortType: 0,
      internalPortType: 129,
      sourceAvailability: 2,
      meAvailability: 0
    },
    <2008 empty items>,
    {
      inputId: 10010,
      longName: 'Program',
      shortName: 'PGM',
      externalPorts: null,
      isExternal: false,
      externalPortType: 0,
      internalPortType: 128,
      sourceAvailability: 3,
      meAvailability: 0
    },
    {
      inputId: 10011,
      longName: 'Preview',
      shortName: 'PVW',
      externalPorts: null,
      isExternal: false,
      externalPortType: 0,
      internalPortType: 128,
      sourceAvailability: 3,
      meAvailability: 0
    }
  ],
  macro: MacroState {
    macroProperties: [
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object]
    ],
    macroPlayer: {
      isRunning: false,
      isWaiting: false,
      loop: false,
      macroIndex: 65535
    },
    macroRecorder: { isRecording: false, macroIndex: 0 }
  },
  settings: SettingsState { multiViewers: { '0': [MultiViewer] }, videoMode: 12 }
}

*/