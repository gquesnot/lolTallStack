<?php

namespace App\View\Components;

use Illuminate\View\Component;

class EnemySummonersFrame extends Component
{
    /**
     * Create a new component instance.
     *
     * @return void
     */
    public ?array $enemyFrames;
    public ?array $participantFrame;

    public function __construct($enemyFrames, $participantFrame)
    {
        $this->enemyFrames = $enemyFrames;
        $this->participantFrame = $participantFrame;
    }


    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|\Closure|string
     */
    public function render()
    {
        return view('components.enemy-summoners-frame');
    }
}
