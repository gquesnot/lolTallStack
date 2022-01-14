<div class="w-5/6 m-auto">
    <div class="w-1/4" x-data="{show: false}">
        <h1>Lol History</h1>
        <div class="flex mb-4 ">

            <div class="mr-4">
                <label class="block text-gray-700 text-sm font-bold mb-2">
                    Username
                </label>
                <input
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    wire:model.lazy="summonerName"
                     @blur="$wire.set('summonerName', $event.target.value)"
                    type="text" placeholder="SummonerName">
            </div>

            <div class="">
                <label class="block text-gray-700 text-sm font-bold mb-2">
                    Matchs
                </label>
                <select wire:model='selectedMatch' class="form-select appearance-none
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
                    @foreach($matchList as $idx => $match)
                        <option value="{{$match}}">{{$match}}</option>
                    @endforeach
                </select>
            </div>
        </div>

    </div>

    @if ($match && $summoners && $matchTimeline)
        <div class="flex mt-6">
            <div class="w-1/4 h-10 mr-4">
                <div class="">
                    <label class="block text-gray-700 text-sm font-bold mb-2">
                        Summoners
                    </label>
                    <select wire:model='participantId'
                            wire:change="updateTimeline"
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
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example">

                        @foreach($summoners as $idx => $summoner)
                            <option value="{{$idx}}">{{$summoner['summonerName']}} - {{$summoner['championName']}}</option>
                        @endforeach


                    </select>
                </div>
            </div>
            <div class="w-3/4 h-10">
                <div class="relative pt-1">
                    <label for="customRange1" class="form-label">Match Timelines : {{$selectedTime}} minutes</label>
                    <input
                        wire:model.debounce.750ms="selectedTime"
                        wire:change="updateTimeline"
                        min="0"
                        max="{{count($matchTimeline['frames']) - 1}}"
                        type="range"
                        class="w-full"
                        id="customRange1"
                    />
                </div>
            </div>
        </div>
        <div class="mt-20 flex">

            <div class="w-1/3">
                <x-my-summoner-frame :participantFrame="$participantFrame" :currentGold="$currentGold"></x-my-summoner-frame>
            </div>
            <div class="w-2/3">
                <x-enemy-summoners-frame :enemyFrames="$enemyFrames" :participantFrame="$participantFrame"></x-enemy-summoners-frame>
            </div>

        </div>
        <div class="mt-12">
            <x-shop :summoner="$summoners[$participantId]" :version="$version" :items="$items" :currentGold="$currentGold" :selectedCategory="$selectedCategory" :modItems="$modItems" :myItemList="$myItemList" :itemCategory="$itemCategory"></x-shop>
        </div>
    @endif
</div>

