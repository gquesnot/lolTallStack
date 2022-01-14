<?php

namespace App\Http\Livewire;

use Livewire\Component;

class MySummonerFrame extends Component
{
    public ?array $participantFrame;
    public int $currentGold = 0;



    public function mount($participantFrame, $currentGold)
    {
        $this->participantFrame = $participantFrame;
        $this->currentGold = $currentGold;
    }


    public function changeCurrentGold($newCurrentGold){
        $this->currentGold = $newCurrentGold;
    }
    public function render()
    {
        return view('livewire.my-summoner-frame');
    }
}
