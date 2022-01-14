<?php

namespace App\View\Components;

use Illuminate\View\Component;

class MySummonerFrame extends Component
{

    public ?array $participantFrame;
    public int $currentGold = 0;



    public function __construct($participantFrame, $currentGold)
    {
        $this->participantFrame = $participantFrame;
        $this->currentGold = $currentGold;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|\Closure|string
     */
    public function render()
    {
        return view('components.my-summoner-frame');
    }
}
