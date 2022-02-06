@extends('layouts.app')

@section('content')
    <div class="w-11/12 m-auto" x-data="lolClass">
        <div class="w-1/4">
            <h1>Lol History</h1>
            <div class="flex mb-4 ">

                <div class="mr-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">
                        Username
                    </label>
                    <input
                        class="shadow appearance-none border rounded w-30 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        x-model="summonerName"
                        x-on:change="setSummonerName"
                        type="text" placeholder="SummonerName">
                </div>

                <div class="">
                    <label class="block text-gray-700 text-sm font-bold mb-2">
                        Matchs
                    </label>
                    <select x-on:change="loadMatch" x-model='matchId' class="form-select appearance-none
      block
      w-56
      px-3
      py-1.5
      text-base
      font-normal
      text-gray-700
      bg-white bg-clip-padding bg-no-repeat
      border border-solid border-gray-300
      rounded
      transition
      ease-in-out
      m-0
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example">

                        <template x-for="match in matchs">
                            <option x-text="match"></option>
                        </template>
                    </select>
                </div>
            </div>

        </div>
        <template x-if="match != null" x-cloak >
            <div class="flex mt-6">
                <div class="w-1/4 h-10 mr-4">
                    <div class="">
                        <label class="block text-gray-700 text-sm font-bold mb-2">
                            Summoners
                        </label>
                        <select x-model="participantName"
                                x-on:change="selectParticipant"
                                class="form-select appearance-none
              block
              w-full
              px-3
              py-1.5
              text-base
              font-normal
              text-gray-700
              bg-white bg-clip-padding bg-no-repeat
              border border-solid border-gray-300
              rounded
              transition
              ease-in-out
              m-0
              focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                aria-label="Default select example">
                            <template x-for="(participant, idx) in participants" :key="participant.summonerName">
                                <option :selected="summonerName === participant.summonerName" :value="participant.summonerName" x-text="participant.summonerName  + ' - '+ participant.championName"></option>
                            </template>


                        </select>
                    </div>
                </div>
                <div class="w-3/4 h-10">
                    <div class="relative pt-1 flex flex-col">
                        <label for="customRange1" class="form-label">Match Timelines : <span x-text="frameId"></span>
                            minutes</label>
                        <input
                            x-on:change="selectFrame"
                            x-model.debounce.750ms="frameId"
                            min="0"
                            :max="maxFrame"
                            type="range"
                            class="w-2/3"
                            id="customRange1"
                        />
                    </div>
                </div>
            </div>
        </template>
        <template x-if="participantFrame != null">
            <div class="">
                <div class="mt-20 flex justify-around">

                    <div class="w-1/4">
                        <x-my-summoner-frame></x-my-summoner-frame>
                    </div>
                    <div class="w-2/3">
                        <x-enemy-summoners-frame></x-enemy-summoners-frame>
                    </div>

                </div>
                <div class="mt-12">
                    <x-shop></x-shop>
                </div>
                <div class="absolute z-30 " x-ref="popUpDescription" id="popUpDescription" x-init="$nextTick(() => {afterInit()})">

                </div>
            </div>

        </template>


    </div>


@endsection
