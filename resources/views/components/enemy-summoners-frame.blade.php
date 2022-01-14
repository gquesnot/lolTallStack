<div class="grid grid-cols-7">
    <div>Summoner Name</div>
    <div>Champ Name</div>
    <div>Armor</div>
    <div>Magic Resit</div>
    <div>Physical Damage Taken %</div>
    <div>Magical Damage Taken %</div>
    <div>Damage Taken</div>

    @foreach($enemyFrames as $enemyFrame)
        <div>{{$enemyFrame['summonerName']}}</div>
        <div>{{$enemyFrame['championName']}}</div>
        <div>{{$enemyFrame['championStats']['armor']}}</div>
        <div>{{$enemyFrame['championStats']['magicResist']}}</div>

        <div>{{round($enemyFrame['championStats']['physicalDamageReductionPercent'], 2)}}</div>
        <div>{{round($enemyFrame['championStats']['magicalDamageReductionPercent'], 2)}}</div>
        <div>{{round($enemyFrame['championStats']['physicalDamageTaken'], 2)}}</div>

    @endforeach
</div>
